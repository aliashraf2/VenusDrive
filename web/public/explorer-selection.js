import {PARTS} from './content.js';
import {COMPONENT_CATEGORIES} from './component-data.js';
export function filteredParts(query='',categoryId='') {
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return PARTS.filter(p=>{
    const category=COMPONENT_CATEGORIES.find(c=>c.id===p.categoryId)?.name||'';
    const text=[p.name,p.system,p.description,category,...p.aliases].join(' ').toLowerCase();
    return (!categoryId||p.categoryId===categoryId)&&words.every(word=>text.includes(word));
  });
}
export function reconcileSelection(selectedId,results) {return results.some(p=>p.id===selectedId)?selectedId:null;}
export function explorerRoute(hash) {
  const [path,search='']=hash.replace(/^#/,'').split('?'),params=new URLSearchParams(search);
  const candidate=path.split('/')[1]||null,category=params.get('category')||'';
  return {partId:PARTS.some(p=>p.id===candidate)?candidate:null,categoryId:COMPONENT_CATEGORIES.some(c=>c.id===category)?category:'',query:params.get('q')||''};
}
export function explorerUrl({partId=null,categoryId='',query=''}={}) {
  const params=new URLSearchParams();if(categoryId)params.set('category',categoryId);if(query.trim())params.set('q',query.trim());
  return '#explorer'+(partId?'/'+partId:'')+(params.size?'?'+params:'');
}
