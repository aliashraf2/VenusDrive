import test from 'node:test';import assert from 'node:assert/strict';import {Backend} from '../public/persistence.js';import {blank} from '../public/core.js';
const cfg={url:'https://test-project.supabase.co',publishableKey:'public-test-key-with-enough-characters'};
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
test('signup, verification and recovery use provider endpoints; logout clears the provider session',async()=>{
 const before=globalThis.location;globalThis.location={origin:'http://localhost:4173'};
 const calls=[],storage=memory(),api=new Backend(cfg,async(url,options)=>{calls.push([url,options]);return Response.json({});},storage);
 try{await api.signUp('a@example.test','test-password');await api.resendVerification('a@example.test');await api.recover('a@example.test');
  assert.ok(calls[0][0].includes('/auth/v1/signup?redirect_to='));
  assert.equal(JSON.parse(calls[1][1].body).type,'signup');
  assert.ok(decodeURIComponent(calls[2][0]).endsWith('/#recovery'));
  api.storeSession({access_token:'test-token',refresh_token:'test-refresh',expires_in:3600});api.user={id:'account-a'};
  await api.signOut();assert.ok(calls[3][0].endsWith('/auth/v1/logout'));assert.equal(api.session,null);assert.equal(api.user,null);assert.equal(storage.getItem('venusdrive.auth.session'),null);
 }finally{globalThis.location=before;}
});
test('managed auth protocol only stores a session after provider response and validates user',async()=>{const calls=[];const api=new Backend(cfg,async(url,options)=>{calls.push([url,options]);return Response.json(url.includes('/token?')?{access_token:'provider-token',refresh_token:'provider-refresh',expires_in:3600}:{id:'account-a',email:'a@example.test'});},memory());assert.equal((await api.signIn('a@example.test','provided-by-test')).id,'account-a');assert.ok(calls[0][0].endsWith('/auth/v1/token?grant_type=password'));assert.equal(calls[1][1].headers.Authorization,'Bearer provider-token');});
test('auth and delivery errors are surfaced; a failed user check clears the candidate session',async()=>{const storage=memory(),api=new Backend(cfg,async url=>url.includes('/token?')?Response.json({access_token:'candidate',expires_in:3600}):Response.json({message:'Unauthorized'},{status:401}),storage);await assert.rejects(api.signIn('a','b'),/Unauthorized/);assert.equal(api.session,null);assert.equal(storage.getItem('venusdrive.auth.session'),null);});
test('save RPC derives owner server-side and keeps revision on a rejected stale save',async()=>{let request;const api=new Backend(cfg,async(url,options)=>{request={url,body:JSON.parse(options.body)};return Response.json({message:'Another device updated your data'},{status:409});},memory());api.session={access_token:'token',expires_at:Date.now()/1000+600};api.version=4;await assert.rejects(api.save(blank()),/Another device/);assert.equal(api.version,4);assert.equal(request.body.expected_version,4);assert.equal('user_id' in request.body,false);});
test('cross-account attachment paths are rejected without sending a request',async()=>{let calls=0;const api=new Backend(cfg,async()=>{calls++;return Response.json({});},memory());api.user={id:'account-a'};await assert.rejects(api.attachment({path:'account-b/receipt.pdf'}),/does not belong/);await assert.rejects(api.deleteAttachment({path:'account-a/../receipt.pdf'}),/does not belong/);assert.equal(calls,0);});
