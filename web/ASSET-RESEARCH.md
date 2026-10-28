> Current implementation: [Static explorer delivery](STATIC-EXPLORER-DELIVERY.md). The older WebGL/model requirements and earlier check counts below are historical and superseded by that report.

# Explorer asset evaluation — 26 October 2026

## Decision and incomplete requirement

No external model file was successfully downloaded and inspected in this session. No verified production-car mechanical model has been integrated. The requested realistic downloaded model remains outstanding. Spectral GT RS was not used.

The new explorer instead renders original triangle geometry with WebGL. This is an interim educational model, not a claim that the downloaded-model requirement has been met. It has approximate component shapes and positions in a generic front-engine chassis. It is not engineering CAD, a repair diagram, replacement-part compatibility evidence, or the user's selected car. Hybrid-specific and high-voltage geometry is missing. A rendered visual review is still required before calling its appearance satisfactory.

## Candidates researched

| Candidate | Publisher evidence | Evaluation |
|---|---|---|
| [Grab3D Car Engine](https://grab3d.com/models/vehicles/car-engine/) | Publisher describes a stylized inline-four mechanical model and offers GLB. The [license notice](https://grab3d.com/dl/car-engine/LICENSE.txt) states CC0 and original procedural geometry. | Potential engine educational asset, not a whole production vehicle. Publisher descriptions are not inspected file coverage. No downloaded file/hash or geometry verification; not integrated. |
| [Khronos CarConcept](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CarConcept/README.md) | Official sample repository provides a GLB, attribution and licensing details; its description says unseen mechanical parts were removed. | Attractive exterior, unsuitable as proof of required internal coverage. Not integrated. Preserve its own attribution if used later; repository licensing alone is insufficient. |
| [Creomoto car on OpenGameArt](https://opengameart.org/content/car-0) | Creator listing offers OBJ/Blender downloads and states CC0. | Generic car, not a verified production model. Engine-related tags do not establish mechanical coverage. Not downloaded/inspected or integrated. |
| [Production-car asset collection](https://github.com/pedrosoandre/carros) | Collection includes separate asset-license information. | Metadata/code license cannot authorize every model. No particular production-car model had both inspected internals and verified asset-specific rights. None integrated. |

Network attempts to download files through shell failed with DNS resolution errors; the web reader could read descriptions but did not deliver binary asset files. Native browser download/review attempts were interrupted by active-window changes. No CAPTCHA or access restriction was bypassed. These failures do not establish that the publishers prohibit download. They mean file contents and reuse qualification remain unverified here.

## Original geometry coverage

The following are actual selectable 3D mesh groups in `educational-model.js`, independently generated for this project. [model-inspection.json](design-review/model-inspection.json) records mesh names and triangle counts. There are no third-party model assets or textures to redistribute, and no third-party asset license is claimed for this original work.

| Requested component | Original representation | Limits |
|---|---|---|
| Engine | Block, head, valve cover | Generic inline layout; no verified engine specification |
| Oil filter | Spin-on canister | Other vehicles use cartridge filters or different positions |
| Dipstick | Tube and yellow loop | Some vehicles have electronic level measurement |
| Air filter | Airbox and pleated insert | Approximate housing; not a fitment reference |
| Low-voltage battery | Case and terminals | Alternative trunk/seat locations described in text |
| Alternator | Vented housing and pulley | Conventional belt-driven example; hybrid systems differ |
| Radiator | Fins, tanks and upper hose | Simplified cooling system |
| Coolant reservoir | Expansion tank and cap | Generic tank, not exact routing or pressure design |
| Brake-fluid reservoir | Reservoir/master-cylinder region | Simplified geometry |
| Washer reservoir | Tank and blue cap | Shape/cap color not universal |
| Belts | Accessory belt loop and pulleys | Not a routing diagram; timing belt not shown |
| Brakes | Rotors, calipers and pad blocks | Disc brake example; no drum layout |
| Tires | Four tires, rims and tread bands | No tire specifications inferred |
| Suspension | Springs, dampers and control arms | Generic arrangement, not exact kinematics |
| Transmission | Bellhousing and gearbox | Simplified longitudinal arrangement |
| Exhaust | Pipe, converter and muffler | No emissions configuration/fitment claim |

The electric filter removes combustion-only groups. It does not supply a true EV architecture or traction battery model. Hybrid currently shares the generic combustion mesh, explicitly without verified hybrid-specific components. Other library entries remain text-only and are labeled as having unavailable geometry; selecting one cannot highlight an invented exact part.

Component purpose, typical-location and safety prose uses the linked care sources in `content.js`; those sources are not engineering provenance for the mesh dimensions. The model's locations are deliberately approximate. A qualified content/visual review and a suitable downloaded mechanical asset remain next steps.

## Safe asset replacement process

Download a candidate into a new directory; retain the original license and creator notice, URL/date and SHA-256. Inspect the actual glTF/GLB/Blender nodes and meshes, then visually isolate each requested component. Record absent and ambiguous groups. Do not mark a component covered because of a filename, exterior texture, listing tag or promotional screenshot. Optimize a derivative only when its license permits it, retaining notices. Keep part-to-mesh mappings separate from the renderer and preserve text-only handling for missing geometry. No purchase is authorized.
