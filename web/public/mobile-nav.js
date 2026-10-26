export function mountMobileNavigation(root,media=window.matchMedia('(max-width:760px)')){
 const sidebar=root.querySelector('#garage-navigation'),workspace=root.querySelector('.workspace'),toggle=root.querySelector('[data-action="menu"]'),close=root.querySelector('[data-nav-close]'),backdrop=root.querySelector('[data-nav-backdrop]');
 if(!sidebar||!toggle)return ()=>{};let opened=false;
 const focusables=()=>[...sidebar.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(x=>!x.hidden);
 function apply(restore=false){const mobile=media.matches;const inactive=mobile&&!opened;
  sidebar.hidden=inactive;sidebar.inert=inactive;sidebar.setAttribute('aria-hidden',String(inactive));
  sidebar.toggleAttribute('data-mobile-open',mobile&&opened);toggle.setAttribute('aria-expanded',String(mobile&&opened));toggle.setAttribute('aria-label',mobile&&opened?'Close navigation':'Open navigation');
  workspace.inert=mobile&&opened;backdrop.hidden=!(mobile&&opened);backdrop.inert=backdrop.hidden;root.classList.toggle('menu-open',mobile&&opened);
  if(mobile&&opened){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');sidebar.setAttribute('aria-label','Garage navigation');}else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');}
  if(restore)toggle.focus();
 }
 function open(){opened=true;apply();focusables()[0]?.focus();}
 function shut(restore=true){opened=false;apply(restore);}
 const onToggle=()=>opened?shut():open(),onClose=()=>shut();
 const onKey=e=>{if(!media.matches||!opened)return;if(e.key==='Escape'){e.preventDefault();shut();}if(e.key==='Tab'){const items=focusables(),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};
 const onResize=()=>{const hadFocus=sidebar.contains(document.activeElement);opened=false;apply(media.matches&&hadFocus);};
 toggle.addEventListener('click',onToggle);close.addEventListener('click',onClose);backdrop.addEventListener('click',onClose);document.addEventListener('keydown',onKey);media.addEventListener('change',onResize);apply();
 return ()=>{workspace.inert=false;toggle.removeEventListener('click',onToggle);close.removeEventListener('click',onClose);backdrop.removeEventListener('click',onClose);document.removeEventListener('keydown',onKey);media.removeEventListener('change',onResize);};
}
