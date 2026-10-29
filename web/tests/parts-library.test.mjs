import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PARTS} from '../public/content.js';
import {partVisual,orientationFor} from '../public/parts-visual-data.js';
import {partsRoute,partsUrl,libraryMatches,partsLibraryPage,mountPartsLibrary} from '../public/parts-library.js';
import {browserFixture} from './dom-fixture.mjs';
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function setup(hash='#parts',mobile=false){const f=browserFixture(hash,mobile);f.root.innerHTML=partsLibraryPage(esc);const cleanup=mountPartsLibrary(f.root,{esc});return {...f,cleanup,click:el=>f.root.emit('click',{target:el})};}

test('all 27 library selections synchronize matching main visual, caption, selector, card and educational destination',()=>{
  const f=setup();try{
    assert.equal(f.root.querySelectorAll('[data-card-part]').length,27);
    for(const part of PARTS){
      f.click(f.root.querySelector(`[data-locate-part="${part.id}"]`));
      const visual=partVisual(part);
      assert.equal(f.root.querySelector('[data-parts-main-image]').src,visual.src,part.id);
      assert.equal(f.root.querySelector('#parts-selected-title').textContent,part.name);
      assert.equal(f.root.querySelector('#parts-highlight-caption').textContent,visual.caption);
      assert.equal(f.root.querySelector('#parts-choice').value,part.id);
      assert.equal(f.root.querySelectorAll('[data-selected="true"]').filter(el=>el.hasAttribute('data-card-part')).length,1);
      const card=f.root.querySelector(`[data-card-part="${part.id}"]`);
      assert.equal(card.getAttribute('data-selected'),'true');
      assert.equal(card.querySelector('a').getAttribute('href'),'#explorer/'+part.id);
      assert.equal(document.activeElement,f.root.querySelector('#parts-selected-title'));
      assert.ok(fs.existsSync(new URL('../public'+visual.src,import.meta.url)));
      assert.ok(fs.existsSync(new URL('../public'+orientationFor(part).src,import.meta.url)));
    }
  }finally{f.cleanup();f.restore();}
});
test('search, original system filters and categories combine and clear stale visual selection on no results',()=>{
  const f=setup();try{
    const search=f.root.querySelector('#parts-search'),system=f.root.querySelector('#parts-system'),category=f.root.querySelector('#parts-category');
    search.value='12v';search.oninput();assert.equal(f.root.querySelector('#parts-choice').value,'battery');
    assert.equal(f.root.querySelectorAll('[data-card-part]').length,1);
    system.value='Cooling';system.onchange();assert.equal(f.root.querySelectorAll('[data-card-part]').length,0);
    assert.equal(f.root.querySelector('[data-parts-main-image]'),null);assert.equal(f.root.querySelector('#parts-choice').disabled,true);
    f.click(f.root.querySelector('[data-parts-clear]'));assert.equal(f.root.querySelectorAll('[data-card-part]').length,27);
    system.value='Brakes';system.onchange();category.value='tires-brakes-suspension';category.onchange();
    assert.equal(f.root.querySelectorAll('[data-card-part]').length,2);
    search.value='pads';search.oninput();assert.equal(f.root.querySelector('#parts-choice').value,'brake-pads');
    assert.deepEqual(libraryMatches({query:'pads',system:'Brakes',categoryId:'tires-brakes-suspension'}).map(p=>p.id),['brake-pads']);
  }finally{f.cleanup();f.restore();}
});
test('deep links and re-entry preserve filters and selected assemblies without accessing garage storage',()=>{
  const url=partsUrl({query:'diff',system:'Transmission and drivetrain',categoryId:'drivetrain',partId:'differential',imageIndex:1});
  assert.deepEqual(partsRoute(url),{query:'diff',system:'Transmission and drivetrain',categoryId:'drivetrain',partId:'differential',imageIndex:1});
  assert.equal(partsRoute('#parts?part=unknown&category=unknown&system=unknown').partId,null);
  const f=setup(url,true);try{
    assert.equal(f.root.querySelector('[data-parts-main-image]').src,'/assets/components/transfer-case.webp');
    assert.equal(f.root.querySelector('#parts-highlight-caption').textContent,'Transfer case highlighted.');
    f.click(f.root.querySelector('[data-parts-assembly="0"]'));
    assert.equal(f.root.querySelector('[data-parts-main-image]').src,'/assets/components/differential.webp');
    const saved=location.hash;f.cleanup();f.root.innerHTML=partsLibraryPage(esc);const cleanup=mountPartsLibrary(f.root,{esc});
    assert.equal(location.hash,saved);assert.equal(f.root.querySelector('#parts-search').value,'diff');cleanup();
  }finally{f.cleanup();f.restore();}
});
test('coordinate masks preserve context, errors are recoverable, and native keyboard selection works',()=>{
  const f=setup('#parts?part=timing-belt',true);try{
    const main=f.root.querySelector('[data-parts-main-image]'),overlay=f.root.querySelector('.parts-highlight');
    assert.equal(overlay.getAttribute('viewBox'),'0 0 1024 1024');assert.ok(overlay.querySelector('mask'));
    assert.equal(overlay.querySelector('image').getAttribute('href'),main.src);
    main.onerror();assert.equal(main.hidden,true);assert.equal(overlay.hasAttribute('hidden'),true);
    assert.equal(f.root.querySelector('.parts-image-error').hidden,false);
    f.click(f.root.querySelector('[data-parts-retry]'));main.onload();assert.equal(main.hidden,false);assert.equal(overlay.hasAttribute('hidden'),false);
    const choice=f.root.querySelector('#parts-choice');choice.value='alternator';choice.onchange();assert.equal(f.root.querySelector('#parts-selected-title').textContent,'Alternator');
    const image=f.root.querySelector('[data-parts-main-image]').src;f.cleanup();choice.value='engine';assert.equal(choice.onchange,null);f.root.emit('click',{target:f.root.querySelector('[data-locate-part="engine"]')});assert.equal(f.root.querySelector('[data-parts-main-image]').src,image);
  }finally{f.cleanup();f.restore();}
});
