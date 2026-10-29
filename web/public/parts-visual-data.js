// Image-coordinate highlights. No vehicle layout is inferred from a saved garage.
export const PART_VISUAL_OVERRIDES = {
  'brake-pads': {src:'/assets/parts-visuals/brake-pads-wheel-cutaway.webp',width:1536,height:1024,embeddedBlue:true,alt:'Exploded wheel and disc-brake example with the two brake pads blue and the tire, disc and caliper neutral',note:'Blue: brake pads. Neutral: tire, disc and caliper. Exploded recognition view; not an assembly or repair instruction.'},
  'brake-fluid': {region:'M145 132 Q260 40 440 85 L481 116 L487 185 Q645 120 787 220 L818 310 L838 411 L813 470 Q635 560 208 588 L130 536 L102 429 L101 316 L151 248 Z',note:'The reservoir is highlighted; the metal master cylinder below stays neutral.'},
  'cabin-filter': {region:'M30 493 L387 319 L847 503 L551 854 L28 580 Z',note:'The filter is highlighted; its surrounding ventilation housing stays neutral.'},
  'belts': {strokes:[{d:'M474 351 L649 257',width:20},{d:'M768 350 L818 752',width:23},{d:'M433 878 L628 916',width:20},{d:'M373 118 C214 87 137 173 158 285',width:69},{d:'M80 357 C22 432 65 462 195 491',width:66},{d:'M948 399 C1003 405 965 467 963 502',width:35}],note:'Visible sections of the accessory belt and rubber hoses are highlighted. The engine and pulleys stay neutral.'},
  'timing-belt': {strokes:[{d:'M428 72 L750 78 C865 82 901 186 868 281 L626 850 C606 919 474 929 434 856 C408 812 423 767 446 714 L521 555 C555 480 505 457 450 434 L361 387 C264 337 238 250 275 164 C303 96 359 63 428 72 Z',width:26}],note:'The toothed belt path is highlighted; the metal gears and engine housing stay neutral.'}
};

export function partVisual(part,index=0) {
  const image=part.images[index]||part.images[0],override=PART_VISUAL_OVERRIDES[part.id]||{};
  return {...image,...override,label:image.label||part.name,caption:(image.label||part.name).split(' —')[0]+' highlighted.'};
}

export function orientationFor(part) {
  const electric=['traction-battery','electric-drive'].includes(part.id);
  return {src:electric?'/assets/parts-visuals/electric-sedan-orientation.webp':'/assets/studio/silver-sedan-cutaway.webp',width:1536,height:1024,alt:electric?'Neutral representative electric-car cutaway showing an underfloor battery enclosure and rear drive unit':'Neutral representative combustion-car cutaway showing typical vehicle systems',label:electric?'Example electric-vehicle layout':'Example combustion-vehicle layout'};
}
