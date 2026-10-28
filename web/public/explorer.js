import {PARTS} from './content.js';
import {COMPONENT_CATEGORIES} from './component-data.js';
import {filteredParts,reconcileSelection,explorerRoute,explorerUrl} from './explorer-selection.js';
import {componentDetail} from './component-detail.js';

export function mount(root,{onGuide,esc}) {
  const initial=explorerRoute(location.hash),saved=history.state?.venusExplorer,mobile=matchMedia('(max-width:800px)');
  let query=initial.query,categoryId=initial.categoryId,current=initial.partId;
  let browserScroll=saved?.browserScroll||0,pageScroll=saved?.pageScroll||0,origin=saved?.origin||null,alive=true;
  if(!current&&!mobile.matches&&!saved)current=categoryId?filteredParts(query,categoryId)[0]?.id||null:'engine';
  root.innerHTML=`<div class="component-intro"><span class="component-count-label">27 PARTS. A CLEARER PICTURE.</span><p>Learn with representative component images. These examples do not identify the equipment or exact locations in your vehicle.</p></div>
    <div class="component-explorer"><section class="component-browser" aria-labelledby="browser-title"><div class="component-browser-header"><span class="studio-kicker">FIND YOUR WAY AROUND</span><h2 id="browser-title">Choose a component.</h2><label class="component-search-label" for="explorer-search">Search car parts</label><div class="component-search"><span aria-hidden="true">⌕</span><input id="explorer-search" type="search" placeholder="Oil filter, tires, 12V battery…" autocomplete="off" value="${esc(query)}"></div><div class="component-categories" role="group" aria-label="Component categories"><button type="button" data-category=""><span aria-hidden="true">▦</span>All components</button>${COMPONENT_CATEGORIES.map(c=>`<button type="button" data-category="${c.id}"><span aria-hidden="true">${c.icon}</span>${esc(c.name)}</button>`).join('')}</div><div class="component-results-toolbar"><span id="explorer-status" role="status" aria-live="polite"></span><button type="button" class="text-button" data-clear-filters>Clear filters</button></div></div><ul class="component-list" id="explorer-results" aria-label="Components"></ul></section>
    <section class="component-detail" aria-label="Selected component"><button type="button" class="button secondary component-back" data-component-back>← Back to components</button><div id="component-detail-content"></div></section></div>`;
  const list=root.querySelector('#explorer-results'),detail=root.querySelector('#component-detail-content'),input=root.querySelector('#explorer-search'),grid=root.querySelector('.component-explorer');
  function snapshot(extra={}){return {query,categoryId,current,browserScroll,pageScroll,origin,...extra};}
  function saveUrl(push=false,extra={}){const previous=push?{}:history.state?.venusExplorer||{};history[push?'pushState':'replaceState']({...history.state,venusExplorer:{...previous,...snapshot(extra)}},'',explorerUrl({partId:current,categoryId,query}));}
  function bindImageErrors(){detail.querySelectorAll('img').forEach(img=>{img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};img.onload=()=>{img.hidden=false;img.nextElementSibling.hidden=true;};});}
  function paintDetail(focus=false){
    const p=PARTS.find(p=>p.id===current);grid.classList.toggle('show-detail',!!p);
    detail.innerHTML=p?componentDetail(p,esc):`<div class="component-empty-detail"><span aria-hidden="true">◇</span><h2>Get to know your car.</h2><p>Choose a component to see what it looks like, what it does, and how to care for it.</p></div>`;bindImageErrors();
    if(focus&&p)requestAnimationFrame(()=>{if(alive){detail.querySelector('h2')?.focus({preventScroll:true});if(mobile.matches)root.scrollIntoView({block:'start',behavior:'instant'});}});
  }
  function paintList(){
    const results=filteredParts(query,categoryId);current=reconcileSelection(current,results);
    root.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===categoryId)));
    root.querySelector('#explorer-status').textContent=`${results.length} ${results.length===1?'component':'components'}`;
    list.innerHTML=results.length?results.map(p=>`<li><button type="button" class="component-card" data-part="${p.id}" aria-pressed="${p.id===current}"><span class="component-thumb"><img src="${esc(p.thumbnail.src)}" alt="" width="${p.thumbnail.width}" height="${p.thumbnail.height}" loading="lazy" decoding="async"><span class="thumb-unavailable" hidden>Image unavailable</span></span><span><strong>${esc(p.name)}</strong><small>${esc(p.system)}</small></span><span class="component-card-indicator" aria-hidden="true">${p.id===current?'✓':''}</span></button></li>`).join(''):`<li class="component-no-results"><h3>No matching components.</h3><p>Try “oil filter” or “battery,” or clear your filters.</p><button class="button secondary" type="button" data-clear-filters>Show all components</button></li>`;
    list.querySelectorAll('img').forEach(img=>{img.onerror=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};});list.scrollTop=browserScroll;
  }
  function filter(){browserScroll=0;paintList();paintDetail();saveUrl();}
  function select(id){
    if(!filteredParts(query,categoryId).some(p=>p.id===id))return;browserScroll=list.scrollTop;pageScroll=window.scrollY;origin=id;
    if(mobile.matches){current=null;saveUrl(false,{returnFocus:id});}current=id;saveUrl(true,{fromBrowser:mobile.matches});
    list.querySelectorAll('[data-part]').forEach(b=>{const active=b.dataset.part===id;b.setAttribute('aria-pressed',String(active));b.querySelector('.component-card-indicator').textContent=active?'✓':'';});paintDetail(true);
  }
  input.oninput=()=>{query=input.value;filter();};
  root.onclick=e=>{
    const b=e.target.closest('button');if(!b)return;if(b.dataset.part)return select(b.dataset.part);
    if(b.hasAttribute('data-category')){categoryId=b.dataset.category;filter();return;}
    if(b.hasAttribute('data-clear-filters')){query='';categoryId='';input.value='';filter();input.focus();return;}
    if(b.hasAttribute('data-component-back')){if(history.state?.venusExplorer?.fromBrowser){history.back();return;}current=null;saveUrl(false,{fromBrowser:false});paintList();paintDetail();input.focus();return;}
    if(b.dataset.relatedGuide)return onGuide(b.dataset.relatedGuide);
    if(b.hasAttribute('data-retry-image')){const img=b.closest('.component-image-frame').querySelector('img');img.src=img.getAttribute('src');}
  };
  const onScroll=()=>{browserScroll=list.scrollTop;saveUrl();};list.addEventListener('scroll',onScroll,{passive:true});
  const resize=()=>{const wasBrowser=root.querySelector('.component-browser').contains(document.activeElement),wasBack=root.querySelector('.component-back')===document.activeElement;paintDetail();if(current&&((mobile.matches&&wasBrowser)||(!mobile.matches&&wasBack)))detail.querySelector('h2')?.focus();};mobile.addEventListener('change',resize);
  paintList();paintDetail(!!initial.partId);saveUrl(false,{fromBrowser:saved?.fromBrowser||false});
  if(saved?.returnFocus&&!current)requestAnimationFrame(()=>{if(alive){if(mobile.matches)window.scrollTo({top:saved.pageScroll||0,behavior:'instant'});list.querySelector(`[data-part="${saved.returnFocus}"]`)?.focus({preventScroll:true});}});
  return ()=>{alive=false;root.onclick=null;input.oninput=null;list.removeEventListener('scroll',onScroll);mobile.removeEventListener('change',resize);};
}
