import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TOUR_VIEWS,tourMarkup} from '../public/studio-tour.js';
import {PREVIEW_TABS,previewData,previewSnapshot} from '../public/interactions.js';

test('showroom uses named static views and matching component links',()=>{
  const html=tourMarkup('test-tour');
  assert.match(html,/Static car views/);
  assert.match(html,/Representative car · static images/);
  assert.doesNotMatch(html,/360|rotate|orbit|drag|data-tour-next/i);
  for(const id of ['engine','tires','battery'])assert.ok(html.includes('href="#explorer/'+id+'"'));
  for(const view of TOUR_VIEWS)assert.ok(fs.existsSync(new URL('../public'+view.src,import.meta.url)),view.src);
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
