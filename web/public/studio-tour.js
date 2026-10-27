// Per-image anchors, not model-space coordinates. Hidden parts are approximate regions.
export const TOUR_VIEWS = [
  {id:'front', label:'Front', src:'/assets/studio/silver-front.jpg', anchors:{engine:[50,49],battery:[66,43],tires:[18,81],brakes:null}},
  {id:'quarter', label:'Front three-quarter', src:'/assets/studio/silver-quarter.jpg', anchors:{engine:[34,43],battery:[53,41],tires:[89,63],brakes:[54,64]}},
  {id:'rear', label:'Rear three-quarter', src:'/assets/studio/silver-rear.jpg', anchors:{engine:null,battery:null,tires:[56,70],brakes:[90,62]}}
];
export const TOUR_PARTS = {
  engine:{name:'Engine & oil', short:'Engine area', partId:'engine', view:0, text:'In a front-engine car, the engine sits beneath the hood. Oil lubricates its moving parts. Use the oil specification and intervals in your owner’s manual.', safety:'Let hot components cool. Keep hands away from moving belts and fans.', location:'Approximate under-hood region. Engine geometry is not visible in this image.'},
  tires:{name:'Tires', short:'Tires', partId:'tires', view:1, text:'Your tires connect the car to the road. Check pressure, tread and visible damage, and follow the vehicle’s rotation guidance.', safety:'Check pressure when tires are cold. Use the door placard or owner’s manual pressure.', location:'Visible tire. Size, pressure and fitment are not inferred from the illustration.'},
  brakes:{name:'Brakes', short:'Brake area', partId:'brake-pads', view:1, text:'Disc brake pads press against a rotor behind the wheel to slow the car. Unusual noise, vibration or changed braking needs professional inspection.', safety:'Never go underneath a vehicle supported only by a jack. Do not touch hot brake parts.', location:'Brake region behind the wheel; individual pad geometry is not shown.'},
  battery:{name:'Low-voltage battery', short:'Battery area', partId:'battery', view:0, text:'The low-voltage battery supplies electrical controls and accessories. It may be under the hood, in the trunk or beneath a seat. It is different from an EV traction battery.', safety:'Do not bridge battery terminals. Beginners must not service high-voltage EV components.', location:'One possible under-hood region, not a verified battery position. The battery is hidden.'}
};
export const cycleView = (index, direction) => (index + direction + TOUR_VIEWS.length) % TOUR_VIEWS.length;
export function selectionForView(selected, index) {
  return selected && TOUR_VIEWS[index]?.anchors[selected] ? selected : null;
}
export function tourMarkup(id) {
  return `<div class="studio-tour" id="${id}">
    <div class="studio-tour-stage" tabindex="0" role="group" aria-label="Silver car image tour. Drag horizontally or use left and right arrow keys to change between three fixed views. Home resets.">
      <img class="studio-car-image" src="${TOUR_VIEWS[0].src}" alt="Generic silver sedan, front view, in a bright photography studio" width="1536" height="1024" fetchpriority="high" decoding="async" draggable="false">
      <div class="tour-highlight" aria-hidden="true" hidden></div><div class="tour-hotspots" aria-label="Component regions"></div>
      <div class="tour-image-failure" hidden><strong>The vehicle image could not load.</strong><p>You can still explore each component using the buttons below.</p><button class="button secondary" data-tour-retry>Retry image</button></div>
      <div class="tour-loading" role="status" hidden>Loading another view…</div>
    </div>
    <div class="tour-toolbar"><div class="tour-angles" role="group" aria-label="Vehicle image angles">${TOUR_VIEWS.map((v,i)=>`<button data-tour-view="${i}" aria-pressed="${i===0}">${v.label}</button>`).join('')}</div><div class="tour-utilities"><button data-tour-next aria-label="Show next vehicle image angle">↔ <span>View angles</span></button><button data-tour-reset>Reset view ↺</button></div></div>
    <div class="tour-bottom"><p class="tour-caption"><span data-tour-caption>Front view</span> · Drag to change angle<br><small>Illustrative image tour · 3 fixed views, not live 3D</small></p><div class="tour-parts" role="group" aria-label="Explore a car component">${Object.entries(TOUR_PARTS).map(([key,p])=>`<button data-tour-part="${key}" aria-pressed="false">${p.short}<span aria-hidden="true">↗</span></button>`).join('')}</div></div>
    <div class="tour-part-info" hidden aria-live="polite"></div>
  </div>`;
}
export function mountStudioTour(root, {onView=()=>{}} = {}) {
  const stage=root.querySelector('.studio-tour-stage'), photo=root.querySelector('.studio-car-image');
  const markers=root.querySelector('.tour-hotspots'), panel=root.querySelector('.tour-part-info');
  const halo=root.querySelector('.tour-highlight'), status=root.querySelector('.tour-loading');
  let index=0, selected=null, ready=false, failed=false, alive=true, requestId=0, start=null, interacted=false;
  const listeners=[];
  const listen=(el,event,fn,opts)=>{el.addEventListener(event,fn,opts);listeners.push(()=>el.removeEventListener(event,fn,opts));};
  function paint() {
    const view=TOUR_VIEWS[index];
    markers.innerHTML=ready&&!failed?Object.entries(view.anchors).filter(([,point])=>point).map(([id,[x,y]])=>`<button class="tour-hotspot ${selected===id?'is-selected':''}" style="left:${x}%;top:${y}%" data-tour-part="${id}" aria-label="${TOUR_PARTS[id].short}: ${TOUR_PARTS[id].location}" aria-pressed="${selected===id}"><span></span><small>${TOUR_PARTS[id].short}</small></button>`).join(''):'';
    const point=selected&&view.anchors[selected];
    halo.hidden=!(ready&&!failed&&point);if(point){halo.style.left=point[0]+'%';halo.style.top=point[1]+'%';halo.dataset.part=selected;}
    root.querySelectorAll('[data-tour-view]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.tourView)===index)));
    root.querySelectorAll('.tour-parts [data-tour-part]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tourPart===selected)));
    root.querySelector('[data-tour-caption]').textContent=view.label+' view';
    panel.hidden=!selected;
    if(selected){const p=TOUR_PARTS[selected];panel.innerHTML=`<div><span class="studio-kicker">A closer look</span><h3>${p.name}</h3><p>${p.text}</p><small>${p.location}</small></div><div><p class="tour-safety">${p.safety}</p><a class="studio-text-link" href="#explorer/${p.partId}">Explore this component ↗</a><button class="tour-close" data-tour-close aria-label="Close component information">×</button></div>`;}
    onView(index);
  }
  async function changeView(next, {manual=true}={}) {
    if(manual)interacted=true;
    const token=++requestId, view=TOUR_VIEWS[next];
    status.hidden=false;
    const candidate=new Image();candidate.src=view.src;
    try {
      await candidate.decode();
      if(!alive||token!==requestId)return;
      index=next;selected=selectionForView(selected,index);photo.src=view.src;
      photo.alt='Generic silver sedan, '+view.label.toLowerCase()+' view, in a bright studio';
      ready=true;failed=false;photo.hidden=false;root.querySelector('.tour-image-failure').hidden=true;paint();
    } catch {
      if(!alive||token!==requestId)return;
      index=next;selected=selectionForView(selected,index);failed=true;ready=false;photo.hidden=true;
      root.querySelector('.tour-image-failure').hidden=false;paint();
    } finally {if(alive&&token===requestId)status.hidden=true;}
  }
  async function select(id) {
    const p=TOUR_PARTS[id];if(!p)return;interacted=true;
    if(!TOUR_VIEWS[index].anchors[id])await changeView(p.view);
    if(!alive)return;selected=id;paint();
  }
  listen(root,'click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.tourPart){select(b.dataset.tourPart);return;}
    if(b.hasAttribute('data-tour-view'))changeView(Number(b.dataset.tourView));
    if(b.hasAttribute('data-tour-next'))changeView(cycleView(index,1));
    if(b.hasAttribute('data-tour-reset')){selected=null;paint();changeView(0);}
    if(b.hasAttribute('data-tour-close')){const previous=selected;selected=null;paint();root.querySelector('.tour-parts [data-tour-part="'+previous+'"]').focus();}
    if(b.hasAttribute('data-tour-retry'))changeView(index);
  });
  listen(stage,'keydown',e=>{if(e.target!==stage)return;if(['ArrowLeft','ArrowRight','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home'){selected=null;changeView(0);}else changeView(cycleView(index,e.key==='ArrowRight'?1:-1));}});
  listen(stage,'pointerdown',e=>{if(e.target.closest('button'))return;start={x:e.clientX,y:e.clientY,id:e.pointerId};});
  listen(stage,'pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)changeView(cycleView(index,dx<0?1:-1));});
  listen(stage,'pointercancel',()=>{start=null;});
  listen(photo,'load',()=>{if(photo.getAttribute('src')===TOUR_VIEWS[index].src){ready=true;failed=false;paint();}});
  listen(photo,'error',()=>{failed=true;ready=false;photo.hidden=true;root.querySelector('.tour-image-failure').hidden=false;paint();});
  ready=photo.complete&&photo.naturalWidth>0;paint();
  return {reveal(){if(!interacted&&index===0)changeView(1,{manual:false});},dispose(){alive=false;requestId++;listeners.forEach(fn=>fn());}};
}
