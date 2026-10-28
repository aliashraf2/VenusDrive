// Small HTML/event fixture for controller tests; this does not verify browser layout.
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
export class Element {
  constructor(tag='div',attrs={}){this.tagName=tag.toLowerCase();this.attrs={...attrs};this.children=[];this.parentElement=null;this.listeners={};this.scrollTop=0;this.value=attrs.value||'';this.hidden='hidden' in attrs;this._text='';}
  get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
  get classList(){return {add:name=>{this.classList.toggle(name,true);},remove:name=>{this.classList.toggle(name,false);},toggle:(name,on)=>{const classes=new Set((this.attrs.class||'').split(' ').filter(Boolean));if(on)classes.add(name);else classes.delete(name);this.attrs.class=[...classes].join(' ');},contains:name=>(this.attrs.class||'').split(' ').includes(name)};}
  setAttribute(k,v){this.attrs[k]=String(v);}
  getAttribute(k){return this.attrs[k]??null;}
  hasAttribute(k){return k in this.attrs;}
  removeAttribute(k){delete this.attrs[k];}
  toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];}
  get checked(){return this.hasAttribute('checked');}
  get isConnected(){return true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  set src(v){this.attrs.src=v;}get src(){return this.attrs.src;}
  get nextElementSibling(){const list=this.parentElement?.children||[];return list[list.indexOf(this)+1]||null;}
  matches(selector){
    if(selector.includes(','))return selector.split(',').some(s=>this.matches(s.trim()));
    if(selector.endsWith(':not([disabled])'))return !this.hasAttribute('disabled')&&this.matches(selector.replace(':not([disabled])',''));
    if(selector.startsWith('#'))return this.attrs.id===selector.slice(1);
    if(selector.startsWith('.'))return this.classList.contains(selector.slice(1));
    const combined=selector.match(/^([\w-]+)(\[.+\])$/);if(combined)return this.tagName===combined[1]&&this.matches(combined[2]);
    const m=selector.match(/^\[([^=\]]+)(?:="?([^"\]]*)"?)?\]$/);if(m)return m[2]===undefined?this.hasAttribute(m[1]):this.getAttribute(m[1])===m[2];
    return this.tagName===selector;
  }
  querySelectorAll(selector){return this.children.flatMap(child=>[...(child.matches(selector)?[child]:[]),...child.querySelectorAll(selector)]);}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
  contains(node){for(let n=node;n;n=n.parentElement)if(n===this)return true;return false;}
  focus(){globalThis.document.activeElement=this;}
  scrollIntoView(){}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  removeEventListener(type,fn){this.listeners[type]=(this.listeners[type]||[]).filter(f=>f!==fn);}
  emit(type,event={}){for(const fn of this.listeners[type]||[])fn(event);}
  get textContent(){return decode(this._text)+this.children.map(c=>c.textContent).join('');}
  set textContent(text){this._text=String(text);this.children=[];}
  set innerHTML(html){
    this.children=[];this._text='';const stack=[this],voids=new Set(['img','input','br','hr','meta','link']);
    for(const token of html.match(/<[^>]+>|[^<]+/g)||[]){
      if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}
      if(token.startsWith('<')){
        const m=token.match(/^<([\w-]+)/);if(!m)continue;const attrs={};
        for(const a of token.slice(m[0].length,-1).matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=decode(a[2]||'');
        const el=new Element(m[1],attrs),parent=stack.at(-1);el.parentElement=parent;parent.children.push(el);if(!voids.has(el.tagName))stack.push(el);
      }else stack.at(-1)._text+=token;
    }
  }
}
export function browserFixture(hash='#explorer',mobile=false){
  const originals=Object.fromEntries(['window','document','location','history','matchMedia','requestAnimationFrame','localStorage'].map(k=>[k,globalThis[k]]));
  const viewport={matches:mobile,listeners:[],addEventListener(_,fn){this.listeners.push(fn);},removeEventListener(_,fn){this.listeners=this.listeners.filter(f=>f!==fn);},resize(value){this.matches=value;this.listeners.forEach(fn=>fn());}};
  const stack=[{hash,state:null}];let at=0;
  globalThis.window={scrollY:0,scrollTo({top}){this.scrollY=top;}};globalThis.document={activeElement:null};globalThis.location={hash};
  globalThis.history={get state(){return stack[at].state;},pushState(state,_,url){stack.splice(++at);stack.push({hash:url,state});location.hash=url;},replaceState(state,_,url){stack[at]={hash:url,state};location.hash=url;},back(){if(at){at--;location.hash=stack[at].hash;}},forward(){if(at<stack.length-1){at++;location.hash=stack[at].hash;}}};
  globalThis.matchMedia=()=>viewport;globalThis.requestAnimationFrame=fn=>{fn();return 1;};
  globalThis.localStorage={getItem(){throw Error('Explorer must not read garage storage');},setItem(){throw Error('Explorer must not write garage storage');}};
  const root=new Element();return {root,viewport,click:el=>root.onclick({target:el}),restore(){Object.assign(globalThis,originals);},get entries(){return stack.length;}};
}
