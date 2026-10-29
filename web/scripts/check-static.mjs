import {LEARNING_SYSTEMS} from '../public/learning-systems.js';
import {partVisual,orientationFor} from '../public/parts-visual-data.js';
import {PARTS} from '../public/content.js';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const pub=path.join(root,'public');let checks=0;
const check=(ok,msg)=>{if(!ok)throw Error(msg);checks++;};
const html=fs.readFileSync(path.join(pub,'index.html'),'utf8');
for(const file of ['app.js','style.css','light-theme.css','static-explorer.css','ui-refinements.css','parts-library.css','assets/vd.svg','assets/vd-white.svg','assets/favicon.svg','logo-review.html','data/catalog.json'])check(fs.existsSync(path.join(pub,file)),'Missing '+file);
check(html.includes('https://venusdrive.com/'),'Canonical domain');check(html.includes('VenusDrive'),'Brand title');
for(const file of fs.readdirSync(pub).filter(n=>n.endsWith('.js'))){const source=fs.readFileSync(path.join(pub,file),'utf8');for(const m of source.matchAll(/(?:from\s*|import\s*\()\s*['"](\.\/[^'"]+)['"]/g))check(fs.existsSync(path.resolve(pub,m[1])),'Broken module import '+m[1]);check(!/service_role\s*[:=]\s*['"][^'"]+/.test(source),'Client secret marker');}
for(const part of PARTS){for(const img of [...part.images,part.thumbnail])check(fs.existsSync(path.join(pub,img.src.slice(1))),'Missing component image '+img.src);check(Object.values(part.education).every(Boolean),'Incomplete education '+part.id);}
for(const part of PARTS)for(const img of [partVisual(part),orientationFor(part)])check(fs.existsSync(path.join(pub,img.src.slice(1))),'Missing parts visual '+img.src);
for(const system of LEARNING_SYSTEMS)check(fs.existsSync(path.join(pub,system.src.slice(1))),'Missing learning illustration '+system.src);
for(const file of fs.readdirSync(pub).filter(n=>n.endsWith('.css'))){const css=fs.readFileSync(path.join(pub,file),'utf8');check((css.match(/\/\*/g)||[]).length===(css.match(/\*\//g)||[]).length,'Unbalanced CSS comment '+file);}
const luminance=hex=>{const [r,g,b]=hex.match(/[a-f0-9]{2}/gi).map(h=>parseInt(h,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
const pairs=[['Graphite on white','#20252B','#FFFFFF'],['Secondary text on cool gray','#58616D','#F5F6F7'],['Black primary action','#FFFFFF','#15181D'],['Neutral status','#47566B','#F0F3F8'],['Blue links','#245BDB','#FFFFFF'],['Overdue badge','#973A2B','#FAEFEC'],['Due soon badge','#73500C','#FAF5E7']];
const contrast=pairs.map(([role,a,b])=>{const x=luminance(a),y=luminance(b),ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);check(ratio>=4.5,'Contrast below 4.5: '+role);return {role,ratio:Math.round(ratio*100)/100};});
console.log(JSON.stringify({checks,contrast,limits:'Static source and mathematical contrast checks only. No browser or live Supabase test.'},null,2));
