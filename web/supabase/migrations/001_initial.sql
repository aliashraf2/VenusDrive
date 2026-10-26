-- Run in a new Supabase project. Never run against unrelated app tables.
create table public.account_data (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null,
 version integer not null default 1,
 updated_at timestamptz not null default now(),
 constraint supported_payload check (coalesce((
   payload->>'schemaVersion' = '1'
   and jsonb_typeof(payload->'vehicles')='array'
   and jsonb_typeof(payload->'tasks')='array'
   and jsonb_typeof(payload->'services')='array'
   and jsonb_typeof(payload->'mileage')='array'
   and jsonb_typeof(payload->'preferences')='object'
   and octet_length(payload::text)<8000000
 ),false))
);
alter table public.account_data enable row level security;
create policy account_read on public.account_data for select to authenticated using ((select auth.uid())=user_id);
create policy account_insert on public.account_data for insert to authenticated with check ((select auth.uid())=user_id);
create policy account_update on public.account_data for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy account_delete on public.account_data for delete to authenticated using ((select auth.uid())=user_id);
-- Writes go only through the revision-checked RPC; no client-supplied user ID.
revoke insert,update,delete on public.account_data from anon,authenticated;
grant select on public.account_data to authenticated;
create function public.save_account_data(new_payload jsonb, expected_version integer) returns integer
language plpgsql security definer set search_path=public as $$
declare current_version integer; result integer; caller uuid:=auth.uid();
begin
 if caller is null then raise exception 'Authentication required'; end if;
 -- Serialize the initial insert as well as subsequent writes for this user.
 perform pg_advisory_xact_lock(hashtextextended(caller::text,0));
 select version into current_version from account_data where user_id=caller for update;
 if coalesce(current_version,0)<>expected_version then raise exception 'Another device updated your data. Reload before saving. No changes were applied.'; end if;
 insert into account_data(user_id,payload,version) values(caller,new_payload,1)
 on conflict(user_id) do update set payload=excluded.payload,version=account_data.version+1,updated_at=now()
 returning version into result;
 return result;
end; $$;
revoke all on function public.save_account_data(jsonb,integer) from public,anon;
grant execute on function public.save_account_data(jsonb,integer) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('receipts','receipts',false,1000000,array['image/jpeg','image/png','application/pdf']);
create policy receipt_read on storage.objects for select to authenticated
 using(bucket_id='receipts' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy receipt_insert on storage.objects for insert to authenticated
 with check(bucket_id='receipts' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy receipt_delete on storage.objects for delete to authenticated
 using(bucket_id='receipts' and (storage.foldername(name))[1]=(select auth.uid())::text);
-- No update policy: object paths are immutable; replacements get a new UUID.
