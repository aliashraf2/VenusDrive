"""Decode the complete static image set and report its dimensions and sizes."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
folder = root / 'public/assets/components'
main = sorted(folder.glob('*.webp'))
thumbs = sorted((folder / 'thumbs').glob('*.webp'))
assert len(main) == 28, 'Expected 28 component assembly images'
assert len(thumbs) == 27, 'Expected 27 component thumbnails'
assert {p.stem for p in thumbs} == {p.stem for p in main} - {'transfer-case'}
learning = sorted((root / 'public/assets/studio').glob('silver-cutaway-*.webp'))
assert len(learning) == 3, 'Expected one cutaway for each learning tab'
files = []
for path in main + thumbs + [root / 'public/assets/studio/silver-sedan-cutaway.webp', root / 'public/assets/studio/silver-sedan-hero-cutout.webp'] + learning:
    expected = (1600, 742) if path.stem == 'silver-sedan-hero-cutout' else (1536, 1024) if path.stem == 'silver-sedan-cutaway' or path.stem.startswith('silver-cutaway-') else (192, 192) if path.parent.name == 'thumbs' else (1024, 1024)
    with Image.open(path) as image:
        image.load()
        if path.stem == 'silver-sedan-hero-cutout':
            assert image.mode == 'RGBA' and image.getchannel('A').getextrema()[0] == 0, 'Hero must preserve transparency'
        assert image.size == expected, (path, image.size, expected)
    files.append(dict(file=str(path.relative_to(root)), width=expected[0], height=expected[1], bytes=path.stat().st_size))
print(json.dumps(dict(mainImages=len(main), thumbnails=len(thumbs), cutawayImages=1, learningSystemImages=len(learning), heroCutouts=1, files=files,
    limits='Decoding and dimensions only; visual matching reviewed separately.'), indent=2))
