import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TOUR_PARTS,TOUR_VIEWS,cycleView,selectionForView,tourMarkup} from '../public/studio-tour.js';
import {PREVIEW_TABS,previewData,previewSnapshot} from '../public/interactions.js';

test('studio tour is honest about fixed illustrative views and offers accessible controls',()=>{
  const html=tourMarkup('test-tour');
  assert.match(html,/3 fixed views, not live 3D/);
  assert.match(html,/role="group" aria-label="Explore a car component"/);
  assert.match(html,/aria-label="Silver car image tour/);
  assert.match(html,/data-tour-reset/);
  assert.match(html,/data-tour-next/);
  for(const view of TOUR_VIEWS)assert.ok(fs.existsSync(new URL('../public'+view.src,import.meta.url)),view.src);
});

test('component highlights remain attached to defined photo regions and clear when absent',()=>{
  for(const part of Object.keys(TOUR_PARTS))assert.ok(TOUR_VIEWS.some(v=>v.anchors[part]),part);
  assert.equal(selectionForView('engine',0),'engine');
  assert.equal(selectionForView('brakes',0),null);
  assert.equal(selectionForView('brakes',1),'brakes');
  assert.equal(selectionForView('unknown',1),null);
  assert.equal(cycleView(2,1),0);
  assert.equal(cycleView(0,-1),2);
});

test('demo preview switches features and computes each vehicle from its own records',()=>{
  assert.deepEqual(PREVIEW_TABS,['garage','maintenance','history','reminders','expenses']);
  const data=previewData(),vehicleIds=data.vehicles.map(v=>v.id);
  for(const id of vehicleIds){const snapshot=previewSnapshot({...data,selectedVehicleId:id});assert.equal(snapshot.vehicle.id,id);assert.ok(snapshot.tasks.every(x=>x.task.vehicleId===id));assert.ok(snapshot.records.every(x=>x.vehicleId===id));}
  assert.notEqual(previewSnapshot(data).vehicle.unit,undefined);
});

test('new cloud account with no vehicles is routed to vehicle setup after restore',()=>{
  const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(app,/else if\(location\.hash==='#dashboard'&&!state\.vehicles\.some\(v=>!v\.archived\)\)location\.hash='vehicles'/);
});
