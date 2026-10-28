"""Optimize approved image-generation outputs; no semantic image changes."""
import json
import sys
from pathlib import Path
from PIL import Image

source, name, prompt = sys.argv[1:]
root = Path(__file__).resolve().parents[1]
studio = name == 'silver-sedan-cutaway'
folder = root / 'public/assets' / ('studio' if studio else 'components')
folder.mkdir(parents=True, exist_ok=True)
with Image.open(source) as image:
    image = image.convert('RGB')
    image.thumbnail((1536, 1024) if studio else (1024, 1024))
    image.save(folder / (name + '.webp'), quality=88, method=6)
    dimensions = image.size
    if not studio and name != 'transfer-case':
        image.thumbnail((192, 192))
        (folder / 'thumbs').mkdir(exist_ok=True)
        image.save(folder / 'thumbs' / (name + '.webp'), quality=85, method=6)
notes = root / 'design-review/static-explorer/image-generation'
notes.mkdir(parents=True, exist_ok=True)
(notes / (name + '.json')).write_text(json.dumps(dict(name=name, source=source, prompt=prompt, tool='built-in image_gen', dimensions=dimensions), indent=2))
print(name, dimensions)
