import {PARTS} from './content.js';

export const LEARNING_SYSTEMS = [
  {id:'engine',categoryId:'engine-fluids',name:'Engine & Oil',partId:'engine',description:'Understand what powers your car and why oil maintenance matters.',src:'/assets/studio/silver-cutaway-engine-oil.webp',alt:'Entire representative silver sedan in a static cutaway, with the engine and oil filter highlighted in blue'},
  {id:'tires',categoryId:'tires-brakes-suspension',name:'Tires & Brakes',partId:'tires',description:'Learn about tire pressure, tread wear, braking, and road safety.',src:'/assets/studio/silver-cutaway-tires-brakes.webp',alt:'Entire representative silver sedan in the same static cutaway, with the tires and disc brakes highlighted in blue'},
  {id:'battery',categoryId:'electrical-lighting',name:'Battery & Electrical',partId:'battery',description:'Understand starting power, battery health, and common electrical symptoms.',src:'/assets/studio/silver-cutaway-battery-electrical.webp',alt:'Entire representative silver sedan in the same static cutaway, with the low-voltage battery and charging components highlighted in blue'}
];
const text=value=>value.replaceAll('&','&amp;');
export function learningSection() {
  const first=LEARNING_SYSTEMS[0];
  return `<section id="understand" class="studio-understand studio-section" aria-labelledby="understand-title"><div class="studio-section-heading"><span class="studio-kicker">LOOK A LITTLE CLOSER</span><h2 id="understand-title">A little knowledge.<br>A better drive.</h2><p>Explore the parts that keep you moving.</p></div>
    <div class="studio-reveal-grid"><figure class="system-visual" id="learning-cutaway" role="tabpanel" aria-labelledby="learning-tab-engine"><div class="learning-cutaway-frame"><img id="system-image" src="${first.src}" alt="${first.alt}" loading="lazy" decoding="async" width="1536" height="1024"><div class="system-image-error" hidden><strong>Cutaway illustration unavailable.</strong><p>You can still explore the selected category.</p><button type="button" class="button secondary" data-learning-retry>Retry illustration</button></div></div><figcaption><span id="learning-system-status" role="status">${text(first.name)} highlighted.</span><span class="system-visual-label">Representative cutaway. Appearance and location vary by vehicle.</span></figcaption></figure>
    <div class="system-selector"><div class="learning-cards" role="tablist" aria-label="Choose a vehicle system" aria-orientation="vertical">${LEARNING_SYSTEMS.map((system,i)=>{const icon=PARTS.find(p=>p.id===system.partId).thumbnail;return `<button type="button" class="learning-tab" id="learning-tab-${system.id}" role="tab" data-system-tab="${system.id}" aria-selected="${i===0}" aria-controls="learning-cutaway" aria-labelledby="learning-title-${system.id}" aria-describedby="learning-copy-${system.id}" tabindex="${i===0?'0':'-1'}"><span class="learning-tab-icon" aria-hidden="true"><img src="${icon.src}" alt="" width="${icon.width}" height="${icon.height}" loading="lazy" decoding="async"></span><span class="learning-tab-copy"><span class="learning-tab-title" id="learning-title-${system.id}">${text(system.name)}</span><span class="learning-tab-description" id="learning-copy-${system.id}">${system.description}</span></span></button>`;}).join('')}</div><a class="button learning-explore" href="#explorer?category=${first.categoryId}">Explore Car Parts</a><p class="studio-note">Choose a system, then explore its components. These examples do not identify your exact vehicle’s equipment.</p></div></div></section>`;
}

export function mountLearning(root) {
  const tabs=[...root.querySelectorAll('[data-system-tab]')],image=root.querySelector('#system-image'),panel=root.querySelector('#learning-cutaway'),status=root.querySelector('#learning-system-status'),link=root.querySelector('.learning-explore'),error=root.querySelector('.system-image-error');
  let selected='engine';
  function select(id,focus=false) {
    const system=LEARNING_SYSTEMS.find(system=>system.id===id);if(!system)return;
    tabs.forEach(tab=>{const active=tab.dataset.systemTab===id;tab.setAttribute('aria-selected',String(active));tab.setAttribute('tabindex',active?'0':'-1');});
    panel.setAttribute('aria-labelledby','learning-tab-'+id);
    link.setAttribute('href','#explorer?category='+system.categoryId);
    status.textContent=system.name+' highlighted.';
    if(selected!==id){selected=id;image.loading='eager';image.hidden=false;error.hidden=true;panel.setAttribute('aria-busy','true');image.alt=system.alt;image.src=system.src;}
    if(focus)tabs.find(tab=>tab.dataset.systemTab===id).focus();
  }
  image.onload=()=>{image.hidden=false;error.hidden=true;panel.setAttribute('aria-busy','false');};
  image.onerror=()=>{image.hidden=true;error.hidden=false;panel.setAttribute('aria-busy','false');};
  const onClick=e=>{const tab=e.target.closest('[data-system-tab]');if(tab){select(tab.dataset.systemTab);return;}if(e.target.closest('[data-learning-retry]')){panel.setAttribute('aria-busy','true');image.loading='eager';image.src=LEARNING_SYSTEMS.find(system=>system.id===selected).src;}};
  const onKey=e=>{
    const tab=e.target.closest('[data-system-tab]');if(!tab||!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const index=tabs.indexOf(tab),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(['ArrowDown','ArrowRight'].includes(e.key)?1:tabs.length-1))%tabs.length;
    select(tabs[next].dataset.systemTab,true);
  };
  root.addEventListener('click',onClick);root.addEventListener('keydown',onKey);select(selected);
  return ()=>{root.removeEventListener('click',onClick);root.removeEventListener('keydown',onKey);image.onload=null;image.onerror=null;};
}
