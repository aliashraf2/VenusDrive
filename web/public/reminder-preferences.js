import {km} from './core.js';
export function effectivePreferences(state,vehicle){return {...state.preferences,...vehicle?.reminderPreferences};}
export function distanceText(valueKm,unit){return (valueKm/(unit==='mi'?1.609344:1)).toFixed(2).replace(/\.00$/,'');}
export function distanceFromInput(value,unit,originalKm=null,originalText=null){
 if(value==null||String(value).trim()===''||!['mi','km'].includes(unit))throw Error('Enter a non-negative reminder distance.');
 const n=Number(value);if(!Number.isFinite(n)||n<0)throw Error('Enter a non-negative reminder distance.');
 if(originalKm!=null&&originalText!=null&&n===Number(originalText))return originalKm;
 return km(n,unit);
}
export function savePreferences(state,vehicleId,values){
 if(!Number.isInteger(values.advanceDays)||values.advanceDays<0||values.advanceDays>365||!Number.isFinite(values.advanceKm)||values.advanceKm<0||values.advanceKm>80000||!Number.isInteger(values.staleDays)||values.staleDays<1||values.staleDays>365)throw Error('Enter valid reminder preferences within the displayed limits.');
 if(vehicleId){if(!state.vehicles.some(v=>v.id===vehicleId))throw Error('Select a vehicle first.');return {...state,vehicles:state.vehicles.map(v=>v.id===vehicleId?{...v,reminderPreferences:{...v.reminderPreferences,...values}}:v)};}
 return {...state,preferences:{...state.preferences,...values}};
}
