// Generic educational regions. Coordinates are in a 700×420 illustration.
// Separate from the renderer to support future licensed vehicle-specific layouts.
export const VIEWS=['side','front','rear','top','engine-bay','cabin','underside'];
export const LOCATIONS={
 'dipstick':{view:'engine-bay',x:285,y:180,region:[265,150,45,70]},
 'coolant-reservoir':{view:'engine-bay',x:480,y:205,region:[450,170,65,75]},
 'engine':{view:'engine-bay',x:350,y:205,region:[275,130,150,150]},
 'oil-filter':{view:'engine-bay',x:295,y:262,region:[265,235,65,55]},
 'radiator':{view:'front',x:350,y:241,region:[230,195,240,80]},
 'air-filter':{view:'engine-bay',x:470,y:180,region:[430,140,90,80]},
 'fuel-system':{view:'underside',x:350,y:300,region:[280,270,140,65]},
 'spark-plugs':{view:'engine-bay',x:350,y:160,region:[305,130,95,60]},
 'catalyst':{view:'underside',x:380,y:204,region:[350,175,60,70]},
 'transmission':{view:'underside',x:350,y:125,region:[290,95,120,65]},
 'brake-pads':{view:'side',x:187,y:284,region:[160,250,65,65]},
 'brake-fluid':{view:'engine-bay',x:230,y:112,region:[200,90,70,50]},
 'steering':{view:'underside',x:350,y:99,region:[220,85,260,40]},
 'suspension':{view:'side',x:497,y:249,region:[465,210,70,85]},
 'tires':{view:'side',x:497,y:283,region:[458,245,80,80]},
 'battery':{view:'engine-bay',x:218,y:211,region:[175,175,85,80]},
 'alternator':{view:'engine-bay',x:425,y:258,region:[390,225,75,65]},
 'lights':{view:'front',x:230,y:184,region:[175,158,140,45]},
 'cabin-filter':{view:'cabin',x:480,y:163,region:[425,130,110,75]},
 'ac':{view:'front',x:350,y:225,region:[220,195,260,65]},
 'wipers':{view:'front',x:350,y:145,region:[230,130,240,28]},
 'washer':{view:'engine-bay',x:492,y:274,region:[460,240,65,70]},
 'belts':{view:'engine-bay',x:404,y:224,region:[375,150,55,115]},
 'timing-belt':{view:'engine-bay',x:299,y:205,region:[280,145,45,110]},
 'differential':{view:'underside',x:350,y:315,region:[300,285,100,60]},
 'traction-battery':{view:'top',x:350,y:230,region:[255,155,190,155]},
 'electric-drive':{view:'underside',x:350,y:100,region:[275,70,150,65]}
};
export function locate(id,layout='combustion'){const r={...LOCATIONS[id]};if(id==='traction-battery'&&layout==='hybrid'){r.x=350;r.y=310;r.region=[270,280,160,60];}return r;}
