export const today=()=>new Date().toISOString().slice(0,10);
export const uid=()=>crypto.randomUUID();
export const km=(n,u)=>Number(n)*(u==='mi'?1.609344:1);
export const displayDistance=(n,u)=>n==null?'—':Math.round(n/(u==='mi'?1.609344:1)).toLocaleString();
export const blank=()=>({schemaVersion:1,vehicles:[],tasks:[],services:[],mileage:[],preferences:{advanceDays:30,advanceKm:800,staleDays:30},selectedVehicleId:null});
export const POWERTRAINS=['gasoline','diesel','hybrid','plug-in hybrid','electric','unknown'];
export const TASKS=[
 ['oil','Engine oil and filter','Lubrication','combustion','oil-filter'],
 ['pressure','Tire pressure check','Wheels and tires','all','tires'],
 ['rotation','Tire rotation','Wheels and tires','all','tires'],
 ['tread','Tire condition and tread','Wheels and tires','all','tires'],
 ['brakes','Brake inspection','Brakes','all','brake-pads'],
 ['engine-filter','Engine air filter','Intake and air filtration','combustion','air-filter'],
 ['cabin-filter','Cabin air filter','Heating and air conditioning','all','cabin-filter'],
 ['battery','Low-voltage battery inspection','Electrical','all','battery'],
 ['coolant','Coolant / cooling system','Cooling','confirm','radiator'],
 ['transmission','Transmission fluid','Transmission and drivetrain','confirm','transmission'],
 ['brake-fluid','Brake fluid','Brakes','all','brake-fluid'],
 ['differential','Differential / transfer-case fluid','Transmission and drivetrain','confirm','differential'],
 ['steering-fluid','Hydraulic power-steering fluid','Steering','confirm','steering'],
 ['washer','Washer fluid','Wipers and visibility','all','washer'],
 ['lights','Lights inspection','Lighting','all','lights'],
 ['wipers','Wipers inspection','Wipers and visibility','all','wipers'],
 ['belts','Belts and hoses','Engine','confirm','belts'],
 ['plugs','Spark plugs','Ignition','spark','spark-plugs'],
 ['timing','Timing belt','Engine','confirm-combustion','timing-belt']
].map(([id,name,category,applicability,partId])=>({id,name,category,applicability,partId}));
export function applicable(template,v){
 if(template.applicability==='all')return true;
 if(v.powertrain==='electric'&&['combustion','spark','confirm-combustion'].includes(template.applicability))return false;
 if(template.applicability==='combustion')return v.powertrain!=='unknown';
 if(template.applicability==='spark')return ['gasoline','hybrid','plug-in hybrid'].includes(v.powertrain);
 return v.features?.[template.id]===true;
}
export function validateVehicle(v){
 if(!Number.isInteger(v.year)||v.year<1886||v.year>new Date().getFullYear()+2)throw Error('Enter a valid vehicle year.');
 if(!v.make?.trim()||!v.model?.trim())throw Error('Make and model are required.');
 if(!POWERTRAINS.includes(v.powertrain)||!['mi','km'].includes(v.unit))throw Error('Choose a powertrain and distance unit.');
 if(!Number.isFinite(v.odometerKm)||v.odometerKm<0||v.odometerKm>10000000)throw Error('Odometer must be a non-negative number below 10,000,000 km.');
 if(v.vin&&!/^[A-HJ-NPR-Z0-9]{17}$/i.test(v.vin))throw Error('VIN must contain 17 valid letters and numbers, without I, O or Q.');
}
export function addVehicle(s,v){validateVehicle(v);const id=v.id||uid();if(s.vehicles.some(x=>x.id===id))throw Error('Vehicle already exists.');return {...s,vehicles:[...s.vehicles,{...v,id,archived:false,mileageUpdated:today()}],mileage:[...s.mileage,{id:uid(),vehicleId:id,km:v.odometerKm,date:today(),reason:'Initial reading'}],selectedVehicleId:id};}
export function editVehicle(s,v){validateVehicle(v);const old=s.vehicles.find(x=>x.id===v.id);if(!old)throw Error('Vehicle not found.');if(v.odometerKm!==old.odometerKm)throw Error('Use Update mileage for reading changes.');return {...s,vehicles:s.vehicles.map(x=>x.id===v.id?{...old,...v}:x)};}
export function updateMileage(s,vehicleId,value,unit,reason=''){
 if(!['mi','km'].includes(unit)||!Number.isFinite(Number(value))||value==='')throw Error('Enter a valid mileage and unit.');
 const v=s.vehicles.find(x=>x.id===vehicleId);if(!v)throw Error('Vehicle not found.');const reading=km(value,unit);
 if(reading<0||reading>10000000)throw Error('Reading is out of range.');
 if(reading<v.odometerKm&&!reason.trim())throw Error('A lower reading needs a correction reason. Historical readings are preserved.');
 return {...s,vehicles:s.vehicles.map(x=>x.id===vehicleId?{...x,odometerKm:reading,mileageUpdated:today()}:x),mileage:[...s.mileage,{id:uid(),vehicleId,km:reading,date:today(),reason:reason.trim()||'Mileage update'}]};
}
export function validDate(d){return typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;}
export function saveTask(s,t){
 if(!s.vehicles.some(v=>v.id===t.vehicleId))throw Error('Vehicle not found.');
 if(!t.name?.trim())throw Error('Name your maintenance task.');
 if(t.months!=null&&(!Number.isInteger(t.months)||t.months<1||t.months>600))throw Error('Time interval must be 1–600 whole months.');
 if(t.distanceKm!=null&&(!Number.isFinite(t.distanceKm)||t.distanceKm<=0))throw Error('Distance interval must be positive.');
 if(t.months==null&&t.distanceKm==null)throw Error('Set a time or distance interval.');
 if(t.baselineDate&&(!validDate(t.baselineDate)||t.baselineDate>today()))throw Error('Baseline date must be valid and not in the future.');
 if(t.baselineKm!=null&&(!Number.isFinite(t.baselineKm)||t.baselineKm<0))throw Error('Baseline mileage must be non-negative.');
 if(t.guidance==='Manufacturer guidance'&&(!t.source||!t.conditions))throw Error('Manufacturer guidance needs a verified source and operating conditions.');
 const task={...t,id:t.id||uid()};return {...s,tasks:[...s.tasks.filter(x=>x.id!==task.id),task]};
}
export function addMonths(date,n){const d=new Date(date+'T00:00:00Z');const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,end));return d.toISOString().slice(0,10);}
export function due(t,v,services,prefs={},at=today()){
 const relevant=services.filter(s=>s.vehicleId===v.id&&s.taskIds.includes(t.id)).sort((a,b)=>b.date.localeCompare(a.date)||b.odometerKm-a.odometerKm||b.id.localeCompare(a.id));
 const last=relevant[0];const baselineDate=last?.date||t.baselineDate||null;const baselineKm=last?.odometerKm??t.baselineKm??null;
 const nextDate=t.months&&baselineDate?addMonths(baselineDate,t.months):null;const nextKm=t.distanceKm&&baselineKm!=null?baselineKm+t.distanceKm:null;
 const days=nextDate?Math.round((Date.parse(nextDate)-Date.parse(at))/86400000):null;
 const remaining=nextKm!=null?nextKm-v.odometerKm:null;
 let status='Upcoming';if((days!=null&&days<=0)||(remaining!=null&&remaining<=0))status='Overdue';
 else if((days!=null&&days<=(t.advanceDays??prefs.advanceDays??30))||(remaining!=null&&remaining<=(t.advanceKm??prefs.advanceKm??800)))status='Due soon';
 if(!nextDate&&nextKm==null)status='History unknown';
 const partial=!!((t.months&&!baselineDate)||(t.distanceKm&&baselineKm==null));
 const snoozed=!!(t.snoozedUntil&&t.snoozedUntil>at);
 return {last,baselineDate,baselineKm,nextDate,nextKm,days,remaining,status,partial,snoozed,notify:t.reminders!==false&&!snoozed&&['Overdue','Due soon'].includes(status)};
}
export function saveService(s,r){
 const v=s.vehicles.find(x=>x.id===r.vehicleId);if(!v)throw Error('Vehicle not found.');
 if(!validDate(r.date)||r.date>today())throw Error('Choose a valid service date, not a future date.');
 if(!Number.isFinite(r.odometerKm)||r.odometerKm<0||r.odometerKm>v.odometerKm+0.01)throw Error('Service mileage must be between zero and the current vehicle reading. Update mileage first if necessary.');
 if(!Number.isSafeInteger(r.costMinor)||r.costMinor<0||r.costMinor>1e12)throw Error('Enter a valid non-negative cost with at most two decimals.');
 if(!/^[A-Z]{3}$/.test(r.currency))throw Error('Choose a supported currency.');
 if(!r.taskIds.length||r.taskIds.some(id=>!s.tasks.some(t=>t.id===id&&t.vehicleId===r.vehicleId)))throw Error('Choose at least one maintenance task for this vehicle.');
 if(new Set(r.taskIds).size!==r.taskIds.length)throw Error('A task can only be selected once.');
 if(r.items?.some(i=>!i.name?.trim()||!Number.isSafeInteger(i.costMinor)||i.costMinor<0))throw Error('Itemized costs need a name and non-negative amount.');
 if((r.items||[]).reduce((n,i)=>n+i.costMinor,0)>r.costMinor)throw Error('Itemized costs cannot exceed the visit total.');
 const record={...r,id:r.id||uid()};
 const duplicate=s.services.some(x=>x.id!==record.id&&x.vehicleId===r.vehicleId&&x.date===r.date&&Math.abs(x.odometerKm-r.odometerKm)<0.01&&x.costMinor===r.costMinor&&x.currency===r.currency&&[...x.taskIds].sort().join() === [...r.taskIds].sort().join());
 if(duplicate)throw Error('A matching service is already saved. Edit that record instead.');
 return {...s,services:[...s.services.filter(x=>x.id!==record.id),record]};
}
export function deleteService(s,id){return {...s,services:s.services.filter(x=>x.id!==id)};}
export function spending(records,group='month'){
 const map=new Map();for(const r of records){const key=[r.currency,group==='year'?r.date.slice(0,4):group==='month'?r.date.slice(0,7):group==='vehicle'?r.vehicleId:group==='method'?r.method:r.category||'Other'].join('|');map.set(key,(map.get(key)||0)+r.costMinor);}
 return [...map].map(([key,costMinor])=>({currency:key.split('|')[0],label:key.split('|')[1],costMinor})).sort((a,b)=>a.currency.localeCompare(b.currency)||a.label.localeCompare(b.label));
}
export function csvExport(s,vehicleId=null){
 const rows=[['Vehicle','Date','Odometer','Unit','Tasks','DIY or mechanic','Shop','Cost','Currency','Parts used','Notes']];
 for(const r of s.services.filter(x=>!vehicleId||x.vehicleId===vehicleId)){const v=s.vehicles.find(x=>x.id===r.vehicleId);rows.push([v?`${v.year} ${v.make} ${v.model}`:r.vehicleId,r.date,r.odometerKm/(v?.unit==='mi'?1.609344:1),v?.unit||'km',r.taskIds.map(id=>s.tasks.find(t=>t.id===id)?.name||id).join('; '),r.method,r.shop,(r.costMinor/100).toFixed(2),r.currency,r.parts,r.notes]);}
 const escape=x=>{let v=String(x??'');if(/^[=+@-]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';};return '\uFEFF'+rows.map(r=>r.map(escape).join(',')).join('\r\n');
}
export function validateState(s){if(s?.schemaVersion!==1||!['vehicles','tasks','services','mileage'].every(k=>Array.isArray(s[k]))||!s.preferences)throw Error('Saved data format is not supported. Export it before continuing.');return s;}
export function demoData(){
 let s=blank();s=addVehicle(s,{id:'demo-car',year:2020,make:'TOYOTA',model:'CAMRY',nickname:'Everyday companion',powertrain:'gasoline',engine:'',trim:'',transmission:'',drivetrain:'',unit:'mi',odometerKm:km(45200,'mi'),features:{}});
 s=saveTask(s,{id:'demo-oil',vehicleId:'demo-car',name:'Engine oil and filter',category:'Lubrication',partId:'oil-filter',months:6,distanceKm:km(5000,'mi'),baselineDate:addMonths(today(),-7),baselineKm:km(40000,'mi'),guidance:'User-defined intervals',source:'Illustrative demo interval, not manufacturer guidance',conditions:'Demo only',reminders:true});
 s=saveTask(s,{id:'demo-tires',vehicleId:'demo-car',name:'Tire pressure check',category:'Wheels and tires',partId:'tires',months:1,distanceKm:null,baselineDate:addMonths(today(),-1),baselineKm:null,guidance:'General guidance',source:'https://www.nhtsa.gov/vehicle-safety/tires',conditions:'Cold tires',reminders:true});
 s=saveService(s,{id:'demo-visit',vehicleId:'demo-car',date:addMonths(today(),-7),odometerKm:km(40000,'mi'),taskIds:['demo-oil'],costMinor:6500,currency:'USD',method:'Mechanic',shop:'Example shop (demo)',category:'Lubrication',notes:'Sample record. Your data is separate.',parts:'',attachments:[],items:[]});return s;
}
