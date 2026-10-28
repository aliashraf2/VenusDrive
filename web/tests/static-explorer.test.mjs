import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PARTS} from '../public/content.js';
import {COMPONENT_CATEGORIES,EXAMPLE_CAPTION} from '../public/component-data.js';
import {componentDetail} from '../public/component-detail.js';
import {filteredParts,reconcileSelection,explorerRoute,explorerUrl} from '../public/explorer-selection.js';
import {mount} from '../public/explorer.js';
import {browserFixture} from './dom-fixture.mjs';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
test('all 27 stable components have separate complete content and matching assets',()=>{
  assert.equal(PARTS.length,27);assert.equal(new Set(PARTS.map(p=>p.id)).size,27);
  assert.deepEqual(COMPONENT_CATEGORIES.map(c=>PARTS.filter(p=>p.categoryId===c.id).length),[11,3,5,4,4]);
  const images=PARTS.flatMap(p=>p.images);assert.equal(images.length,28);assert.equal(new Set(images.map(i=>i.src)).size,28);
  const hashes=new Set();
  for(const p of PARTS){
    assert.ok(p.applicability);for(const value of Object.values(p.education))assert.ok(value.length>20,p.id);
    const html=componentDetail(p,esc);assert.ok(html.includes(esc(p.name)));assert.ok(html.includes(EXAMPLE_CAPTION));
    for(const title of ['What it does','Where it is usually located','Common warning signs','Basic care','When to get professional help'])assert.ok(html.includes(title));
    for(const img of [...p.images,p.thumbnail]){const file=new URL('../public'+img.src,import.meta.url);assert.ok(img.alt&&img.width&&img.height);const data=fs.readFileSync(file);assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');assert.ok(data.length>500);if(img.width===1024)hashes.add(crypto.createHash('sha256').update(data).digest('hex'));}
  }
  assert.equal(hashes.size,28,'Every main image is a separate asset');
  const diff=PARTS.find(p=>p.id==='differential');assert.deepEqual(diff.images.map(i=>i.label),['Differential','Transfer case — where fitted']);
  assert.equal(PARTS.find(p=>p.id==='oil-filter').images[0].src,'/assets/components/oil-filter.webp');
});
test('search aliases and category filters combine without hiding EV components',()=>{
  assert.equal(filteredParts().length,27);
  assert.deepEqual(filteredParts('  12V   BATTERY  ','electrical-lighting').map(p=>p.id),['battery']);
  assert.deepEqual(filteredParts('ev battery').map(p=>p.id),['traction-battery']);
  assert.deepEqual(filteredParts('oil filter','cabin-visibility'),[]);
  assert.equal(filteredParts('oil filter','engine-fluids')[0].id,'oil-filter');
  assert.equal(reconcileSelection('oil-filter',filteredParts('xyznotapart')),null);
  assert.equal(reconcileSelection('battery',filteredParts('battery')),'battery');
});
test('component routes preserve valid filters and safely reject unknown IDs',()=>{
  const values={partId:'oil-filter',categoryId:'engine-fluids',query:'oil filter'};
  assert.deepEqual(explorerRoute(explorerUrl(values)),values);
  assert.deepEqual(explorerRoute('#explorer/not-a-part?category=bad'),{partId:null,categoryId:'',query:''});
  assert.equal(explorerRoute('#explorer/traction-battery').partId,'traction-battery');
});
test('desktop selection synchronizes every component image, heading and active card',()=>{
  const f=browserFixture();let cleanup;try{
    cleanup=mount(f.root,{onGuide(){},esc});assert.equal(f.root.querySelector('#component-title').textContent,'Engine');
    for(const p of PARTS){f.click(f.root.querySelector(`[data-part="${p.id}"]`));assert.equal(f.root.querySelector('#component-title').textContent,p.name);assert.equal(f.root.querySelector('.component-image-frame').querySelector('img').getAttribute('src'),p.images[0].src);assert.equal(f.root.querySelector(`[data-part="${p.id}"]`).getAttribute('aria-pressed'),'true');}
    const search=f.root.querySelector('#explorer-search');search.value='not-a-part';search.oninput();assert.equal(f.root.querySelector('#component-title'),null);assert.equal(f.root.querySelectorAll('[data-part]').length,0);
  }finally{cleanup?.();f.restore();}
});
test('mobile detail Back and native history restore query, category, scroll and focus',()=>{
  const f=browserFixture('#explorer?category=engine-fluids',true);let cleanup;try{
    cleanup=mount(f.root,{onGuide(){},esc});assert.equal(f.root.querySelector('#component-title'),null);
    const search=f.root.querySelector('#explorer-search');search.value='oil';search.oninput();const before=f.entries;
    assert.equal(f.entries,before);const list=f.root.querySelector('#explorer-results');list.scrollTop=122;window.scrollY=764;
    f.click(f.root.querySelector('[data-part="oil-filter"]'));assert.equal(f.root.querySelector('#component-title').textContent,'Oil filter');assert.equal(document.activeElement.attrs.id,'component-title');
    assert.ok(history.state.venusExplorer.fromBrowser);f.click(f.root.querySelector('[data-component-back]'));cleanup();cleanup=mount(f.root,{onGuide(){},esc});
    assert.equal(f.root.querySelector('#component-title'),null);assert.equal(f.root.querySelector('#explorer-search').value,'oil');assert.equal(f.root.querySelector('#explorer-results').scrollTop,122);assert.equal(document.activeElement.dataset.part,'oil-filter');assert.equal(window.scrollY,764);
    history.forward();cleanup();cleanup=mount(f.root,{onGuide(){},esc});assert.equal(f.root.querySelector('#component-title').textContent,'Oil filter');
  }finally{cleanup?.();f.restore();}
});
test('direct mobile links, responsive focus and unavailable images have usable fallbacks',()=>{
  const f=browserFixture('#explorer/oil-filter',true);let cleanup;try{
    cleanup=mount(f.root,{onGuide(){},esc});const img=f.root.querySelector('.component-image-frame').querySelector('img');img.onerror();assert.ok(img.hidden);assert.equal(img.nextElementSibling.hidden,false);f.click(f.root.querySelector('[data-retry-image]'));img.onload();assert.equal(img.hidden,false);
    f.click(f.root.querySelector('[data-component-back]'));assert.equal(f.root.querySelector('#component-title'),null);assert.equal(document.activeElement.attrs.id,'explorer-search');
    f.viewport.resize(false);f.click(f.root.querySelector('[data-part="battery"]'));f.root.querySelector('[data-part="battery"]').focus();f.viewport.resize(true);assert.equal(document.activeElement.attrs.id,'component-title');
  }finally{cleanup?.();f.restore();}
});
