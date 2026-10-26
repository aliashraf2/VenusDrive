import {BACKEND} from './config.js';
import {blank,demoData,validateState} from './core.js';
export const configured=(config=BACKEND)=>/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)&&config.publishableKey.length>20;
const SESSION='venusdrive.auth.session';
export class Backend {
 constructor(config=BACKEND,transport=globalThis.fetch,storage=globalThis.sessionStorage){this.config=config;this.transport=transport;this.storage=storage;this.session=null;this.version=0;this.user=null;this.refreshing=null;}
 async request(endpoint,options={},auth=true){
  if(!configured(this.config))throw Error('Cloud accounts are not configured. Cloud sign-in is not available in this installation.');
  if(auth)await this.refresh();
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{const res=await this.transport(this.config.url+endpoint,{...options,signal:controller.signal,headers:{apikey:this.config.publishableKey,...(auth&&this.session?{Authorization:'Bearer '+this.session.access_token}:{}),...(!(options.body instanceof Blob)?{'Content-Type':'application/json'}:{}),...options.headers}});
   const body=await res.text();let data;try{data=body?JSON.parse(body):null;}catch{data=body;}
   if(!res.ok)throw Error(typeof data==='object'?(data?.msg||data?.message||data?.error_description||data?.error||'Request failed'):'Request failed ('+res.status+')');return data;
  }catch(e){if(e.name==='AbortError')throw Error('The request timed out. Your changes were not confirmed saved. Retry after checking your connection.');throw e;}finally{clearTimeout(timer);}
 }
 storeSession(s){this.session={...s,expires_at:s.expires_at||Math.floor(Date.now()/1000)+(s.expires_in||3600)};this.storage.setItem(SESSION,JSON.stringify(this.session));}
 async refresh(){if(!this.session)throw Error('Sign in to access your cloud data.');if(this.session.expires_at>Date.now()/1000+60)return;if(this.refreshing)return this.refreshing;this.refreshing=(async()=>{try{const s=await this.request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:this.session.refresh_token})},false);this.storeSession(s);}catch{throw Error('Your session expired. Sign in again. Unsaved form data is still on this page.');}finally{this.refreshing=null;}})();return this.refreshing;}

 async restore(){const fragment=new URLSearchParams(location.hash.slice(1));let recovery=false;
  if(fragment.get('error_description')){history.replaceState(null,'',location.pathname);throw Error(fragment.get('error_description'));}
  if(fragment.get('access_token')){this.storeSession({access_token:fragment.get('access_token'),refresh_token:fragment.get('refresh_token'),expires_in:Number(fragment.get('expires_in'))||3600});recovery=fragment.get('type')==='recovery';history.replaceState(null,'',location.pathname+'#'+(recovery?'recovery':'dashboard'));}
  else {const s=this.storage.getItem(SESSION);if(s)try{this.session=JSON.parse(s);}catch{this.storage.removeItem(SESSION);}}
  if(this.session){this.user=await this.request('/auth/v1/user');}return {user:this.user,recovery};
 }
 async signIn(email,password){this.user=null;const s=await this.request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})},false);this.storeSession(s);try{this.user=await this.request('/auth/v1/user');return this.user;}catch(e){this.storage.removeItem(SESSION);this.session=null;throw e;}}
 async signUp(email,password){return this.request('/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+'/#dashboard'),{method:'POST',body:JSON.stringify({email,password})},false);}
 async resendVerification(email){return this.request('/auth/v1/resend',{method:'POST',body:JSON.stringify({type:'signup',email,options:{emailRedirectTo:location.origin+'/#dashboard'}})},false);}
 async recover(email){return this.request('/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+'/#recovery'),{method:'POST',body:JSON.stringify({email})},false);}
 async password(password){await this.request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password})});}
 async signOut(){await this.request('/auth/v1/logout',{method:'POST'});this.storage.removeItem(SESSION);this.session=null;this.user=null;}
 async load(){const rows=await this.request('/rest/v1/account_data?select=payload,version');this.version=rows[0]?.version||0;return rows[0]?validateState(rows[0].payload):blank();}
 async save(state){const version=await this.request('/rest/v1/rpc/save_account_data',{method:'POST',body:JSON.stringify({new_payload:state,expected_version:this.version})});this.version=version;}
 async upload(file,id){await validateFileBytes(file);const ext=file.type==='application/pdf'?'pdf':file.type==='image/png'?'png':'jpg';const objectPath=this.user.id+'/'+id+'.'+ext;await this.request('/storage/v1/object/receipts/'+objectPath,{method:'POST',body:file,headers:{'Content-Type':file.type}});return {name:file.name,type:file.type,path:objectPath};}
 async attachment(a){this.validatePath(a.path);await this.refresh();const res=await this.transport(this.config.url+'/storage/v1/object/authenticated/receipts/'+a.path,{headers:{apikey:this.config.publishableKey,Authorization:'Bearer '+this.session.access_token}});if(!res.ok)throw Error('Attachment could not be loaded.');return URL.createObjectURL(await res.blob());}
 async deleteAttachment(a){if(a.path){this.validatePath(a.path);await this.request('/storage/v1/object/receipts',{method:'DELETE',body:JSON.stringify({prefixes:[a.path]})});}}
 validatePath(path){if(!this.user||typeof path!=='string'||!path.startsWith(this.user.id+'/')||!/^[-a-zA-Z0-9]+\/[-a-zA-Z0-9]+\.(pdf|png|jpg)$/.test(path))throw Error('This attachment does not belong to the signed-in account.');}
 async deleteAccount(){await this.request('/functions/v1/delete-account',{method:'POST',body:'{}'});this.storage.removeItem(SESSION);this.session=null;this.user=null;}
}
export class LocalStore {
 constructor(mode='local',storage=globalThis.localStorage){this.key='venusdrive.v1.'+mode;this.storage=storage;this.mode=mode;this.raw=null;}
 async load(){const raw=this.storage.getItem(this.key);this.raw=raw;if(!raw)return this.mode==='demo'?demoData():blank();try{return validateState(JSON.parse(raw));}catch{throw Error('Saved browser data cannot be read. It has not been overwritten. Export or inspect this browser storage before resetting it.');}}
 async save(s){if(this.storage.getItem(this.key)!==this.raw)throw Error('Another tab changed this workspace. Refresh before saving; your form is still open.');const data=JSON.stringify(s);if(data.length>4000000)throw Error('Browser storage is full. Remove an attachment or export your records. No changes were saved.');this.storage.setItem(this.key,data);this.raw=data;}
 async upload(file){await validateFileBytes(file);return {name:file.name,type:file.type,data:await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Could not read attachment.'));r.readAsDataURL(file);})};}
 async attachment(a){return a.data;}
 async deleteAttachment(){}
}
export function validateAttachment(file){if(!['image/jpeg','image/png','application/pdf'].includes(file.type))throw Error('Choose a JPG, PNG or PDF receipt.');if(file.size>1000000)throw Error('Each attachment must be under 1 MB in this first version.');}

export async function validateFileBytes(file){validateAttachment(file);const b=new Uint8Array(await file.slice(0,8).arrayBuffer());const valid=file.type==='application/pdf'?String.fromCharCode(...b.slice(0,5))==='%PDF-':file.type==='image/png'?[137,80,78,71,13,10,26,10].every((x,i)=>b[i]===x):b[0]===255&&b[1]===216&&b[2]===255;if(!valid)throw Error('The file content does not match its claimed format. Choose a real JPG, PNG or PDF.');}
