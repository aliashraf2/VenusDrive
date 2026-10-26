// Inspects the original generated mesh, not an external downloaded asset.
import fs from 'node:fs/promises';
import {educationalScene,MODEL_INFO,COVERAGE} from '../public/educational-model.js';
const report={date:'2026-10-26',model:MODEL_INFO,externalDownloadInspected:false,layouts:{}};
for(const layout of ['combustion','hybrid','electric']){
 const scene=educationalScene(layout);
 const groups=Object.fromEntries(Object.entries(COVERAGE).map(([id,description])=>{
  const meshes=scene.meshes.filter(m=>m.partId===id);
  return [id,{description,available:meshes.length>0,meshNames:meshes.map(m=>m.name),triangles:meshes.reduce((n,m)=>n+m.positions.length/9,0)}];
 }));
 report.layouts[layout]={meshCount:scene.meshes.length,triangles:scene.meshes.reduce((n,m)=>n+m.positions.length/9,0),components:groups};
}
report.limitations=['Original approximate geometry, not a production vehicle or repair diagram.','Hybrid uses combustion geometry; hybrid-specific and high-voltage geometry is unavailable.','Electric filters remove combustion components; this is not a verified EV architecture.','Presence of triangles does not establish visual realism or engineering accuracy. Browser inspection remains required.'];
await fs.writeFile(new URL('../design-review/model-inspection.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.layouts).map(([k,v])=>[k,{meshes:v.meshCount,triangles:v.triangles,componentGroups:Object.values(v.components).filter(c=>c.available).length}]))));
