import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {learningSection,LEARNING_SYSTEMS,mountLearning} from '../public/learning-systems.js';
import {browserFixture} from './dom-fixture.mjs';

test('learning tabs use distinct representative images and retain all three category destinations',()=>{
  const html=learningSection();assert.doesNotMatch(html,/[→↗➜➔]/);
  assert.equal(new Set(LEARNING_SYSTEMS.map(s=>s.src)).size,3);
  assert.deepEqual(LEARNING_SYSTEMS.map(s=>s.categoryId),['engine-fluids','tires-brakes-suspension','electrical-lighting']);
  for(const system of LEARNING_SYSTEMS){assert.ok(fs.existsSync(new URL('../public'+system.src,import.meta.url)));assert.ok(system.alt.includes('highlighted in blue'));}
  const f=browserFixture();try{
    f.root.innerHTML=html;
    for(const tab of f.root.querySelectorAll('[data-system-tab]')){assert.equal(tab.getAttribute('role'),'tab');assert.equal(tab.getAttribute('aria-controls'),'learning-cutaway');assert.ok(tab.querySelector('img'));}
    assert.equal(f.root.querySelector('.learning-explore').textContent,'Explore Car Parts');
  }finally{f.restore();}
});

test('clicking anywhere on each learning tab synchronizes selection, cutaway, icon and explorer destination',()=>{
  const f=browserFixture();let cleanup;try{
    f.root.innerHTML=learningSection();cleanup=mountLearning(f.root);
    assert.equal(f.root.querySelector('[data-system-tab="engine"]').getAttribute('aria-selected'),'true');
    for(const system of LEARNING_SYSTEMS){
      const tab=f.root.querySelector(`[data-system-tab="${system.id}"]`);
      f.root.emit('click',{target:tab.querySelector('.learning-tab-description')});
      assert.equal(f.root.querySelectorAll('[aria-selected="true"]').length,1);
      assert.equal(tab.getAttribute('aria-selected'),'true');assert.equal(tab.getAttribute('tabindex'),'0');
      assert.equal(f.root.querySelector('#system-image').src,system.src);
      if(system.id!=='engine')assert.equal(f.root.querySelector('#system-image').alt,system.alt);
      assert.equal(f.root.querySelector('.learning-explore').getAttribute('href'),'#parts?category='+system.categoryId);
      assert.equal(f.root.querySelector('#learning-cutaway').getAttribute('aria-labelledby'),tab.getAttribute('id'));
      assert.equal(f.root.querySelector('#learning-system-status').textContent,system.name+' highlighted.');
    }
  }finally{cleanup?.();f.restore();}
});

test('keyboard navigation wraps, focuses the selected tab, and image retry keeps the chosen system',()=>{
  const f=browserFixture();let cleanup;try{
    f.root.innerHTML=learningSection();cleanup=mountLearning(f.root);
    function key(id,key){let prevented=false;f.root.emit('keydown',{target:f.root.querySelector(`[data-system-tab="${id}"]`),key,preventDefault(){prevented=true;}});assert.ok(prevented);}
    key('engine','ArrowDown');assert.equal(document.activeElement.dataset.systemTab,'tires');
    key('tires','End');assert.equal(document.activeElement.dataset.systemTab,'battery');
    key('battery','ArrowDown');assert.equal(document.activeElement.dataset.systemTab,'engine');
    key('engine','ArrowUp');assert.equal(document.activeElement.dataset.systemTab,'battery');
    const image=f.root.querySelector('#system-image'),error=f.root.querySelector('.system-image-error');image.onerror();assert.ok(image.hidden);assert.equal(error.hidden,false);
    f.root.emit('click',{target:f.root.querySelector('[data-learning-retry]')});assert.equal(image.src,LEARNING_SYSTEMS[2].src);assert.equal(f.root.querySelector('#learning-cutaway').getAttribute('aria-busy'),'true');
    image.onload();assert.equal(image.hidden,false);assert.equal(error.hidden,true);
    key('battery','Home');assert.equal(document.activeElement.dataset.systemTab,'engine');
    cleanup();cleanup=null;const before=image.src;f.root.emit('click',{target:f.root.querySelector('[data-system-tab="tires"]')});assert.equal(image.src,before);
  }finally{cleanup?.();f.restore();}
});
