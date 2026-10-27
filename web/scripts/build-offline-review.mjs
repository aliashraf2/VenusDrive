// Review-only single-file packaging, so a local browser can inspect the actual UI
// when this executor cannot bind a preview socket. Production stays buildless.
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),pub=path.join(root,'public');
const modules=["core.js","config.js","persistence.js","content.js","catalog.js","locations.js","vehicle-art.js","educational-model.js","explorer-2d.js","explorer-selection.js","webgl-explorer.js","explorer.js","studio-tour.js","interactions.js","landing.js","info-pages.js","mobile-nav.js","reminder-preferences.js","app.js"];
const logo=await fs.readFile(path.join(pub,'assets/vd.svg'));
const logoURL='data:image/svg+xml;base64,'+logo.toString('base64');
const media={};for(const name of ['silver-front.jpg','silver-quarter.jpg','silver-rear.jpg','daylight-garage.jpg'])media['/assets/studio/'+name]='data:image/jpeg;base64,'+(await fs.readFile(path.join(pub,'assets/studio',name))).toString('base64');
let bundle='const M = Object.create(null);\n';
for(const name of modules){let source=await fs.readFile(path.join(pub,name),'utf8');const exports=[...source.matchAll(/export\s+(?:async\s+)?(?:function|class|const|let)\s+(\w+)/g)].map(m=>m[1]);
 source=source.replace(/export\s*\{([^}]+)\}\s*from\s*['"]\.\/([^'"]+)['"];?/g,(_,names,dep)=>{exports.push(...names.split(',').map(n=>n.trim()));return `const {${names}}=M[${JSON.stringify(dep)}];`;});
 source=source.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"];?/g,(_,alias,dep)=>`const ${alias}=M[${JSON.stringify(dep)}];`)
 .replace(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/([^'"]+)['"];?/g,(_,names,dep)=>`const {${names}}=M[${JSON.stringify(dep)}];`)
 .replace(/\bexport\s+(?=(?:async\s+)?(?:function|class|const|let)\b)/g,'')
 .replace(/import\(['"]\.\/([^'"]+)['"]\)/g,(_,dep)=>`Promise.resolve(M[${JSON.stringify(dep)}])`);
 if(name==='config.js'){source=source.replace("logo:'/assets/vd.svg'",'logo:'+JSON.stringify(logoURL));source=source.replace(/const BACKEND =[^\n]+/,'const BACKEND = Object.freeze({url:"",publishableKey:""});');}
 if(name==='catalog.js')source=source.replace("fetch('/data/catalog.json')","Promise.resolve(new Response(document.querySelector('#offline-catalog').textContent,{status:200}))");
 source=source.replaceAll('/assets/vd.svg',logoURL);for(const [url,dataURL] of Object.entries(media))source=source.replaceAll(url,dataURL);
 // Review storage has its own key prefix. Existing product data stays untouched.
 if(name==='persistence.js')source=source.replace("'venusdrive.v1.'","'venusdrive.review.v1.'");
 if(name==='app.js')source=source.replaceAll("'venusdrive.mode'","'venusdrive.review.mode'");
 bundle+=`M[${JSON.stringify(name)}]=(()=>{\n${source}\nreturn {${exports.join(',')}};\n})();\n`;
}
const css=await fs.readFile(path.join(pub,'style.css'),'utf8'),data=await fs.readFile(path.join(pub,'data/catalog.json'),'utf8');
let html=await fs.readFile(path.join(pub,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="/style.css">','<style>'+css+'</style>').replace('<script type="module" src="/app.js"></script>','').replaceAll('/assets/vd.svg',logoURL).replace('/assets/favicon.svg',logoURL);
html=html.replace('<script src="/runtime-config.js"></script>','').replace('<link rel="stylesheet" href="/light-theme.css">','<style>'+(await fs.readFile(path.join(pub,'light-theme.css'),'utf8'))+'</style>');
html=html.replace('</body>',`<script id="offline-catalog" type="application/json">${data.replaceAll('<','\\u003c')}</script><script>${bundle.replaceAll('</script','<\\/script')}</script></body>`);
const target=path.join(root,'design-review');await fs.mkdir(target,{recursive:true});await fs.writeFile(path.join(target,'VenusDrive-offline-review.html'),html);await fs.writeFile(path.join(target,'review-bundle.js'),bundle);
console.log('Review only: '+path.join(target,'VenusDrive-offline-review.html'));
