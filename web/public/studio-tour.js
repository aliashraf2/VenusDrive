import {PARTS} from './content.js';
export const TOUR_VIEWS = [
  {name:'Front three-quarter',src:'/assets/studio/silver-sedan-hero-cutout.webp',alt:'Representative silver sedan, entire vehicle visible in front three-quarter view',width:1600,height:742,cutout:true},
  {name:'Front',src:'/assets/studio/silver-front.jpg',alt:'Representative silver sedan in a bright studio, front view'},
  {name:'Rear',src:'/assets/studio/silver-rear.jpg',alt:'Representative silver sedan in a bright studio, rear view'}
];
export function tourMarkup(id='hero-tour') {
  const first=TOUR_VIEWS[0];
  return `<section class="static-showroom" id="${id}" aria-label="Silver sedan and component examples"><div class="showroom-image"><img data-showroom-image src="${first.src}" alt="${first.alt}" width="${first.width||1536}" height="${first.height||1024}" fetchpriority="high" decoding="async"><p class="showroom-image-error" hidden>Car image unavailable. You can still explore every component below.</p></div><div class="showroom-toolbar"><div class="static-angles" role="group" aria-label="Static car views">${TOUR_VIEWS.map((v,i)=>`<button type="button" data-static-view="${i}" aria-pressed="${i===0}">${v.name}</button>`).join('')}</div><span>Representative car · static images</span></div><div class="showroom-parts" aria-label="Meet the components">${['engine','tires','battery'].map(id=>{const p=PARTS.find(p=>p.id===id);return `<a href="#explorer/${p.id}"><img src="${p.thumbnail.src}" width="64" height="64" alt="" loading="lazy"><span><small>MEET THE PART</small><strong>${id==='battery'?'Battery':id==='tires'?'Wheels & tires':p.name}</strong></span></a>`;}).join('')}</div></section>`;
}
export function mountStudioTour(root) {
  const img=root.querySelector('[data-showroom-image]'),error=root.querySelector('.showroom-image-error');
  img.onerror=()=>{img.hidden=true;error.hidden=false;};img.onload=()=>{img.hidden=false;error.hidden=true;};
  const click=e=>{const b=e.target.closest('[data-static-view]');if(!b)return;const view=TOUR_VIEWS[Number(b.dataset.staticView)];if(!view)return;img.src=view.src;img.alt=view.alt;img.width=view.width||1536;img.height=view.height||1024;img.toggleAttribute('data-showroom-photo',!view.cutout);root.querySelectorAll('[data-static-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));};
  root.addEventListener('click',click);
  return {dispose(){root.removeEventListener('click',click);img.onerror=null;img.onload=null;}};
}
