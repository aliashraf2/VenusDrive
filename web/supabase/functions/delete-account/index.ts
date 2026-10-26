// Supabase Edge Function. Server secrets are supplied by Supabase, never config.js.
const headers={'Access-Control-Allow-Origin':Deno.env.get('APP_ORIGIN')||'http://localhost:4173','Access-Control-Allow-Headers':'authorization, apikey, content-type','Content-Type':'application/json'};
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='POST')return new Response('{"error":"Method not allowed"}',{status:405,headers});
 const url=Deno.env.get('SUPABASE_URL')!;const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const token=req.headers.get('Authorization');
 if(!token)return new Response('{"error":"Authentication required"}',{status:401,headers});
 const who=await fetch(url+'/auth/v1/user',{headers:{apikey:service,Authorization:token}});
 if(!who.ok)return new Response('{"error":"Invalid session"}',{status:401,headers});
 const user=await who.json();
 const admin={apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'};
 try{
  // Remove files first. If cleanup fails the account remains and can retry.
  let done=false;while(!done){
   const list=await fetch(url+'/storage/v1/object/list/receipts',{method:'POST',headers:admin,body:JSON.stringify({prefix:user.id+'/',limit:100})});
   if(!list.ok)throw Error('Receipt cleanup failed. Account retained.');
   const files=await list.json();if(!files.length){done=true;break;}
   const del=await fetch(url+'/storage/v1/object/receipts',{method:'DELETE',headers:admin,body:JSON.stringify({prefixes:files.map((f:{name:string})=>user.id+'/'+f.name)})});
   if(!del.ok)throw Error('Receipt cleanup failed. Account retained.');
  }
  const deletion=await fetch(url+'/auth/v1/admin/users/'+user.id,{method:'DELETE',headers:admin});
  if(!deletion.ok)throw Error('Account deletion failed. Retry or contact your configured administrator.');
  return new Response('{"deleted":true}',{headers});
 }catch(e){return new Response(JSON.stringify({error:(e as Error).message}),{status:500,headers});}
});
