import {PARTS,partSearch} from './content.js';
import {COMPONENT_CATEGORIES,EXAMPLE_CAPTION} from './component-data.js';
import {partVisual,orientationFor} from './parts-visual-data.js';

const systems=[...new Set(PARTS.map(p=>p.system))];
export function partsRoute(hash) {
  const params=new URLSearchParams(hash.split('?')[1]||'');
  const candidate=params.get('part'),system=params.get('system'),category=params.get('category');
  return {query:params.get('q')||'',system:systems.includes(system)?system:'',categoryId:COMPONENT_CATEGORIES.some(c=>c.id===category)?category:'',partId:PARTS.some(p=>p.id===candidate)?candidate:null,imageIndex:params.get('assembly')==='1'?1:0};
}
export function partsUrl({query='',system='',categoryId='',partId=null,imageIndex=0}={}) {
  const p=new URLSearchParams();if(query.trim())p.set('q',query.trim());if(system)p.set('system',system);if(categoryId)p.set('category',categoryId);if(partId)p.set('part',partId);if(imageIndex)p.set('assembly',String(imageIndex));return '#parts'+(p.size?'?'+p:'');
}
export function libraryMatches({query='',system='',categoryId=''}={}) {
  return partSearch(query,system).filter(p=>!categoryId||p.categoryId===categoryId);
}
export function partCards(parts,selected,esc) {
  return parts.map(p=>`<article class="card part-tile library-part-card" data-card-part="${p.id}" data-selected="${p.id===selected}"><div class="part-card-heading"><img src="${p.thumbnail.src}" alt="" width="52" height="52" loading="lazy" decoding="async"><span class="system">${esc(p.system)}</span></div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="actions"><a class="text-button" href="#explorer/${p.id}">Learn about this part</a><button type="button" class="text-button" data-locate-part="${p.id}" aria-pressed="${p.id===selected}">Locate part</button></div></article>`).join('')||'<div class="card empty parts-empty"><h3>No matching parts.</h3><p>Try another name or clear the filters to see all 27 components.</p><button type="button" class="button secondary" data-parts-clear>Clear filters</button></div>';
}
export function partsLibraryPage(esc) {
  return `<div id="parts-library-root"><section class="parts-visual-explorer" id="parts-visual" aria-label="Visual component explorer"><div id="parts-stage" class="parts-stage"></div><div class="parts-visual-controls"><span class="eyebrow">LOOK A LITTLE CLOSER</span><label for="parts-system">System<select id="parts-system"><option value="">All systems</option>${systems.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select></label><label for="parts-choice">Component<select id="parts-choice"></select></label><div id="parts-brief" class="parts-brief" aria-live="polite"></div></div></section><section class="parts-card-library" aria-labelledby="parts-library-title"><div class="row between"><div><span class="eyebrow">THE COMPONENT LIBRARY</span><h2 id="parts-library-title">Get to know every part.</h2></div><p id="parts-count" role="status" aria-live="polite"></p></div><div class="filters parts-library-filters"><label class="parts-search-label" for="parts-search">Search parts<input id="parts-search" type="search" placeholder="Oil filter, alternator, 12V battery…"></label><label for="parts-category">Category<select id="parts-category"><option value="">All categories</option>${COMPONENT_CATEGORIES.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label><button type="button" class="text-button" data-parts-clear>Clear filters</button></div><div id="parts-results" class="list-grid parts-grid"></div><p class="form-note">${PARTS.length} introductory components. Representative examples; no replacement-part compatibility is verified.</p></section></div>`;
}

// Blue maps shadows and midtones while white stays white. A clipped overlay leaves
// non-selected housing/engine regions unchanged. Both layers share the image viewBox.
function highlightedImage(part,image,esc) {
  const key='parts-blue-'+part.id,mask=key+'-mask',dark=key+'-dark',clipped=image.region||image.strokes;
  return `<div class="parts-picture" aria-busy="true"><img data-parts-main-image src="${esc(image.src)}" alt="${esc(image.alt)}" width="${image.width}" height="${image.height}" decoding="async" fetchpriority="high">${image.embeddedBlue?'':`<svg class="parts-highlight" viewBox="0 0 ${image.width} ${image.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><filter id="${key}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer result="blue-tint"><feFuncR type="table" tableValues="0.05 1"/><feFuncG type="table" tableValues="0.3 1"/><feFuncB type="table" tableValues="0.95 1"/></feComponentTransfer><feComposite in="SourceGraphic" in2="blue-tint" operator="arithmetic" k2="0.35" k3="0.65"/></filter>${clipped?`<mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="${image.width}" height="${image.height}">${image.region?`<path d="${image.region}" fill="white"/>`:image.strokes.map(s=>`<path d="${s.d}" fill="none" stroke="white" stroke-width="${s.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</mask>`:''}${image.strokes?`<filter id="${dark}-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="-.2126 -.7152 -.0722 0 1 -.2126 -.7152 -.0722 0 1 -.2126 -.7152 -.0722 0 1 0 0 0 1 0"/><feComponentTransfer><feFuncR type="linear" slope="4" intercept="-2"/><feFuncG type="linear" slope="4" intercept="-2"/><feFuncB type="linear" slope="4" intercept="-2"/></feComponentTransfer></filter><mask id="${dark}" maskUnits="userSpaceOnUse" x="0" y="0" width="${image.width}" height="${image.height}"><image href="${esc(image.src)}" width="${image.width}" height="${image.height}" filter="url(#${dark}-filter)"/></mask>`:''}</defs><g ${image.strokes?`mask="url(#${dark})"`:''}><image href="${esc(image.src)}" width="${image.width}" height="${image.height}" filter="url(#${key})" ${clipped?`mask="url(#${mask})"`:''}/></g></svg>`}<div class="parts-image-error" hidden><strong>Illustration unavailable.</strong><p>You can still read about this component.</p><button type="button" class="button secondary" data-parts-retry>Retry image</button></div></div>`;
}
export function mountPartsLibrary(root,{esc}) {
  let state=partsRoute(location.hash),alive=true;
  const stage=root.querySelector('#parts-stage'),brief=root.querySelector('#parts-brief'),cards=root.querySelector('#parts-results'),system=root.querySelector('#parts-system'),choice=root.querySelector('#parts-choice'),search=root.querySelector('#parts-search'),category=root.querySelector('#parts-category');
  function save(){history.replaceState(history.state,'',partsUrl(state));}
  function paintVisual() {
    const part=PARTS.find(p=>p.id===state.partId);
    if(!part){stage.innerHTML='<div class="parts-no-visual"><h2>No matching component.</h2><p>Clear your search or choose another system.</p></div>';brief.innerHTML='<p>Select a matching component to see its image and explanation.</p>';return;}
    const image=partVisual(part,state.imageIndex),context=orientationFor(part);
    stage.innerHTML=`<figure class="parts-main-figure">${highlightedImage(part,image,esc)}<figcaption><strong id="parts-highlight-caption">${esc(image.caption)}</strong><span>${EXAMPLE_CAPTION}</span><span class="parts-visual-note">${esc(image.note||'Blue is an illustrative selection tint, not the component’s real color.')}</span></figcaption></figure>${part.images.length>1?`<div class="parts-assembly-choice" role="group" aria-label="Choose an assembly">${part.images.map((img,i)=>`<button type="button" data-parts-assembly="${i}" aria-pressed="${i===state.imageIndex}">${esc(img.label)}</button>`).join('')}</div>`:''}<details class="parts-orientation"><summary>Vehicle orientation</summary><img data-parts-context src="${context.src}" width="${context.width}" height="${context.height}" alt="${context.alt}" loading="lazy" decoding="async"><p>${context.label}. This separate neutral cutaway is for overall orientation. Exact locations and equipment vary.</p></details>`;
    brief.innerHTML=`<span class="parts-selected-label">SELECTED COMPONENT</span><h2 id="parts-selected-title" tabindex="-1">${esc(part.name)}</h2><p>${esc(part.description)}</p><div class="parts-location"><h3>Usually found</h3><p>${esc(part.education.location)}</p></div><p class="parts-applicability">${esc(part.applicability)}</p><a class="button secondary" href="#explorer/${part.id}">Learn about this part</a>`;
    const img=stage.querySelector('[data-parts-main-image]'),picture=stage.querySelector('.parts-picture'),overlay=stage.querySelector('.parts-highlight'),error=stage.querySelector('.parts-image-error');
    img.onload=()=>{if(!alive)return;img.hidden=false;if(overlay)overlay.toggleAttribute('hidden',false);error.hidden=true;picture.setAttribute('aria-busy','false');};
    img.onerror=()=>{if(!alive)return;img.hidden=true;if(overlay)overlay.toggleAttribute('hidden',true);error.hidden=false;picture.setAttribute('aria-busy','false');};
    if(img.complete&&img.naturalWidth)img.onload();
    const orientation=stage.querySelector('[data-parts-context]');orientation.onerror=()=>{orientation.hidden=true;};
  }
  function paint() {
    const matches=libraryMatches(state);
    if(!matches.some(p=>p.id===state.partId)){state.partId=matches.find(p=>p.id==='engine')?.id||matches[0]?.id||null;state.imageIndex=0;}
    const selected=PARTS.find(p=>p.id===state.partId);if(state.imageIndex>=(selected?.images.length||0))state.imageIndex=0;
    search.value=state.query;system.value=state.system;category.value=state.categoryId;
    choice.innerHTML=matches.length?matches.map(p=>`<option value="${p.id}" ${p.id===state.partId?'selected':''}>${esc(p.name)}</option>`).join(''):'<option value="">No matching components</option>';
    choice.value=state.partId||'';choice.disabled=!matches.length;choice.setAttribute('data-selected',String(!!state.partId));
    root.querySelector('#parts-count').textContent=matches.length+' of '+PARTS.length+' components';cards.innerHTML=partCards(matches,state.partId,esc);paintVisual();save();
  }
  function locate(id,focus=true) {
    if(!libraryMatches(state).some(p=>p.id===id))return;
    state.partId=id;state.imageIndex=0;paint();
    if(focus){root.querySelector('#parts-visual').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});brief.querySelector('h2')?.focus({preventScroll:true});}
  }
  search.oninput=()=>{state.query=search.value;paint();};
  system.onchange=()=>{state.system=system.value;paint();};
  category.onchange=()=>{state.categoryId=category.value;paint();};
  choice.onchange=()=>locate(choice.value,false);
  const click=e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-locate-part')){locate(b.dataset.locatePart);return;}
    if(b.hasAttribute('data-parts-clear')){state={query:'',system:'',categoryId:'',partId:'engine',imageIndex:0};paint();search.focus();return;}
    if(b.hasAttribute('data-parts-assembly')){state.imageIndex=Number(b.dataset.partsAssembly);paintVisual();save();return;}
    if(b.hasAttribute('data-parts-retry')){const img=stage.querySelector('[data-parts-main-image]');img.src=img.getAttribute('src');stage.querySelector('.parts-picture').setAttribute('aria-busy','true');}
  };
  root.addEventListener('click',click);paint();
  return ()=>{alive=false;root.removeEventListener('click',click);search.oninput=null;system.onchange=null;category.onchange=null;choice.onchange=null;};
}
