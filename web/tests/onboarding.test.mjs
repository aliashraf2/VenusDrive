import test from 'node:test';
import assert from 'node:assert/strict';
import {setImmediate} from 'node:timers/promises';
import {Element} from './dom-fixture.mjs';
import * as C from '../public/core.js';

test('landing garage actions load old data, cancel safely, and save through existing onboarding',async()=>{
  const keys=['document','window','location','history','matchMedia','requestAnimationFrame','localStorage','sessionStorage','fetch','FormData','setTimeout','clearTimeout'];
  const originals=Object.fromEntries(keys.map(k=>[k,globalThis[k]]));
  const page=new Element();page.innerHTML='<a class="skip"></a><link rel="canonical"><div id="app"></div><dialog id="modal"></dialog><div id="toast"></div>';
  const media={matches:false,addEventListener(){},removeEventListener(){}};
  const old=C.demoData();old.vehicles.push({...old.vehicles[0],id:'archived-car',nickname:'Archived test vehicle',archived:true});
  const oldRaw=JSON.stringify(old),data=new Map([['venusdrive.v1.local',oldRaw]]),session=new Map();
  const storage=map=>({getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)});
  let hash='#vehicles';
  const listeners={};
  globalThis.document={querySelector:s=>page.querySelector(s),querySelectorAll:s=>page.querySelectorAll(s),createElement:tag=>new Element(tag),addEventListener(){},removeEventListener(){},activeElement:null};
  globalThis.window={matchMedia:()=>media,addEventListener:(type,fn)=>{listeners[type]=fn;},scrollTo(){}};
  globalThis.location={get hash(){return hash;},set hash(v){hash=v.startsWith('#')?v:'#'+v;},origin:'http://localhost:4173'};
  globalThis.history={state:null,pushState(state,_,url){this.state=state;hash=url;},replaceState(state,_,url){this.state=state;hash=url;}};
  globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};
  globalThis.matchMedia=()=>media;globalThis.requestAnimationFrame=fn=>{fn();return 1;};
  globalThis.localStorage=storage(data);globalThis.sessionStorage=storage(session);
  globalThis.fetch=async()=>new Response('[]',{status:200});
  globalThis.FormData=class {
    constructor(form){this.values=new Map();for(const el of [...form.querySelectorAll('input'),...form.querySelectorAll('select'),...form.querySelectorAll('textarea')]){
      const name=el.getAttribute('name');if(!name)continue;if(el.getAttribute('type')==='checkbox'&&!el.checked)continue;
      let value=el.value||'';if(el.tagName==='select')value=(el.children.find(x=>x.hasAttribute('selected'))||el.children[0])?.getAttribute('value')||'';
      this.values.set(name,el.getAttribute('type')==='file'?{size:0}:value);
    }}
    get(k){return this.values.get(k)??null;}has(k){return this.values.has(k);}
  };
  const run=async name=>page.querySelector('#app').onclick({target:new Element('button',{'data-action':name})});
  try{
    await import('../public/app.js?onboarding-test');await setImmediate();
    // Exercise the actual action dispatch without needing a rendered browser.
    await run('open-garage');assert.equal(data.get('venusdrive.v1.local'),oldRaw);
    await run('start-garage');const dialog=page.querySelector('#modal');assert.ok(dialog.open);assert.equal(data.get('venusdrive.v1.local'),oldRaw);
    dialog.querySelector('[data-cancel]').emit('click');assert.equal(dialog.open,false);assert.equal(data.get('venusdrive.v1.local'),oldRaw);
    // Reopen from the existing action and submit the real form callback.
    await run('start-garage');
    for(const [name,value] of Object.entries({year:'2022',make:'Example',model:'Sedan',reading:'12345',nickname:'New local test car'}))dialog.querySelector(`[name=${name}]`).value=value;
    const form=dialog.querySelector('form');await form.onsubmit({preventDefault(){},currentTarget:form});
    const next=JSON.parse(data.get('venusdrive.v1.local'));
    assert.equal(next.vehicles.length,3);assert.deepEqual(next.vehicles.slice(0,2),old.vehicles);assert.deepEqual(next.tasks,old.tasks);assert.deepEqual(next.services,old.services);assert.deepEqual(next.preferences,old.preferences);assert.deepEqual(next.mileage.slice(0,old.mileage.length),old.mileage);
    assert.equal(next.vehicles[2].nickname,'New local test car');assert.equal(next.vehicles[2].unit,'mi');assert.equal(next.vehicles[2].odometerKm,C.km(12345,'mi'));assert.equal(location.hash,'#dashboard');assert.equal(dialog.open,false,form.querySelector('.form-error').textContent);
    assert.equal(data.has('venusdrive.v1.demo'),false);
    const localAfterSave=data.get('venusdrive.v1.local');
    await run('demo');await run('reset-demo');
    const confirmation=dialog.querySelector('form');confirmation.querySelector('[name=confirmation]').value='Reset demo';
    await confirmation.onsubmit({preventDefault(){},currentTarget:confirmation});
    assert.equal(data.get('venusdrive.v1.local'),localAfterSave);assert.ok(data.has('venusdrive.v1.demo'));
    await run('enter-local');data.set('venusdrive.v1.local','invalid existing data');
    await run('start-garage');assert.equal(dialog.open,false);assert.equal(data.get('venusdrive.v1.local'),'invalid existing data');
    assert.match(page.querySelector('#toast').textContent,/cannot be read/);
  }finally{Object.assign(globalThis,originals);}
});
