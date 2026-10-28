# Studio imagery

These four images were generated for VenusDrive with OpenAI image generation on 2026-10-27 from a single generic unbranded silver-sedan art direction. They depict a coherent illustrative vehicle in a bright photo studio and daylight garage; they are not photos of a production make/model. The images are not 3D geometry and do not establish component location, fitment, or specifications.

`silver-front.jpg`, `silver-quarter.jpg`, and `silver-rear.jpg` are compressed reviewable static views used by the landing-page image tour. The interactive controls switch among those three views and mark approximate image regions. `daylight-garage.jpg` is the landing page closing image. Visitors can still use the existing separately labeled educational explorer in the application.

No third-party vehicle model, branded vehicle design, or external stock image is included in these assets. There is no third-party license attribution to retain. Keep the limitations above with the images if they are moved or reused.

## Static learning update — 2026-10-27

The landing page now uses explicitly named static Front three-quarter, Front and Rear images. Dragging, automatic angle changes, rotation hints and approximate exterior hotspots were removed. Component-thumbnail links open the matching static detail view.

`silver-sedan-cutaway.webp` is a separate original generated image showing a representative silver combustion sedan with exposed engine, brakes, low-voltage battery and drivetrain. It uses the same bright studio direction and is an educational illustration, not a verified mechanical layout or the user's exact vehicle. The engine/battery are not marked on arbitrary opaque exterior panels. Its built-in image-generation prompt/source is recorded in `web/design-review/static-explorer/image-generation/silver-sedan-cutaway.json` (path from repository root).

The old WebGL explorer is removed. See `web/STATIC-EXPLORER-DELIVERY.md` for current implementation and verification status. Earlier notes about the separate 3D explorer describe historical behavior.

## Split hero revision

`silver-sedan-hero-cutout.webp` (1600 × 742, alpha transparency) was edited from `silver-quarter.jpg` with the built-in image-generation tool. The full vehicle remains visible in a tightly framed front three-quarter view. Transparent padding was trimmed for export; the existing source photograph remains unchanged for the dashboard preview. Prompt/reference/provenance: `design-review/static-explorer/image-generation/silver-sedan-hero-cutout.json`.

The landing hero uses a 40/60 text/image grid with a two-line left-aligned heading, compact laptop spacing, and stacked mobile content. Alpha allows the vehicle to blend into a CSS showroom background without a rectangular photo boundary. Static Front and Rear selectors remain available; their existing source photos are unchanged.

## Learning tabs revision — 2026-10-27

The learning section now displays three separate matching 1536 × 1024 static cutaway images:

- `silver-cutaway-engine-oil.webp`: engine and oil filter highlighted in blue.
- `silver-cutaway-tires-brakes.webp`: tires and the visible disc brake/caliper highlighted in blue.
- `silver-cutaway-battery-electrical.webp`: low-voltage battery, alternator and connecting electrical components highlighted in blue.

The new artwork keeps the full silver sedan visible, retaining the same vehicle framing and lighting across system selections. It replaces `silver-sedan-cutaway.webp` in the active landing section; that earlier file remains as historical source artwork. These are representative examples, not verified vehicle-specific diagrams. Color highlights are illustrative rather than real component colors.

Images were created using the built-in `image_gen` tool, starting from the existing sedan exterior reference and then applying focused edits to one common cutaway. The complete prompt/source records are in `design-review/learning-tabs/silver-cutaway-*.json` (paths from `web/`). Production WebP files are roughly 172–186 KB each. No text or interface is baked into them. Circular tab icons reuse the existing individual component thumbnails; the blue badge treatment is CSS.
