import hashlib, json, sys
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]) if len(sys.argv)>1 else root.parent / 'VenusDrive_model_lists.zip'
with ZipFile(source) as z:
    rows = json.loads(z.read('VenusDrive_vehicle_models.json'))
    for row in rows:
        assert all(key in row for key in ['make','year','model','source_url','retrieved'])
        assert isinstance(row['year'],int) and row['make'] and row['model']
        key='|'.join([row['make'],str(row['year']),row['model'],str(row.get('nhtsa_model_id',''))])
        row['catalog_id']='cat-'+hashlib.sha256(key.encode()).hexdigest()[:16]
    assert len({r['catalog_id'] for r in rows})==len(rows), 'Duplicate catalog keys; inspect rather than merge'
    target=root/'public'/'data'
    target.mkdir(parents=True,exist_ok=True)
    (target/'catalog.json').write_text(json.dumps(rows,separators=(',',':')))
    (target/'catalog-README.txt').write_bytes(z.read('README.txt'))
    print(json.dumps({'rows':len(rows),'makes':len({r['make'] for r in rows}),'year_min':min(r['year'] for r in rows),'year_max':max(r['year'] for r in rows)}))
