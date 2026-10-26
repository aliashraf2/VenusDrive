import {partSearch,partApplies} from './content.js';
export function filteredParts(query,system,layout){return partSearch(query,system).filter(p=>partApplies(p,layout));}
export function reconcileSelection(selectedId,results,{query='',chooseFirst=false}={}){if(results.some(p=>p.id===selectedId))return selectedId;if(chooseFirst&&query.trim()&&results.length)return results[0].id;return null;}
