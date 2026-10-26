"""Dry-run by default. --apply performs the documented, conflict-checked task rollback."""
from pathlib import Path
import csv, hashlib, json, sys

ROOT = Path(__file__).resolve().parents[4]
EVIDENCE = Path(__file__).resolve().parent
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest().upper()
rows = list(csv.DictReader((EVIDENCE/'rollback-manifest.csv').open(encoding='utf-8-sig')))

def inside_root(relative):
    path = (ROOT/relative).resolve()
    if ROOT.resolve() not in path.parents:
        raise RuntimeError('OUTSIDE PROJECT: '+relative)
    return path

conflicts = []
for row in rows:
    target = inside_root(row['File'])
    if not target.is_file() or digest(target) != row['SHA256After']:
        conflicts.append(row['File']+': current bytes differ from task after-checkpoint')
    if row['ExistedBefore']=='True':
        backup = inside_root(row['Backup'])
        if not backup.is_file() or digest(backup) != row['SHA256Before']:
            conflicts.append(row['File']+': backup absent or changed')
if conflicts:
    print(json.dumps({'status':'CONFLICT — NO WRITES','conflicts':conflicts},ensure_ascii=False,indent=2))
    sys.exit(2)
if '--apply' not in sys.argv:
    print(json.dumps({'status':'DRY RUN PASS — NO WRITES','existingRestorable':sum(r['ExistedBefore']=='True' for r in rows),'newTaskFiles':sum(r['ExistedBefore']=='False' for r in rows),'actualRollback':'NOT PERFORMED'}))
    sys.exit(0)

# Current task after-hashes and all backups were checked before any live write.
for row in rows:
    if row['ExistedBefore']=='True':
        inside_root(row['File']).write_bytes(inside_root(row['Backup']).read_bytes())
for row in rows:
    if row['ExistedBefore']=='True':
        assert digest(inside_root(row['File']))==row['SHA256Before']

# Only remove specifically registered new files after restoring the source that referenced them.
new_rows=[r for r in rows if r['ExistedBefore']=='False']
for row in new_rows:
    name=Path(row['File']).name
    for source in (ROOT/'src').rglob('*'):
        if source.is_file() and source.suffix in {'.ts','.tsx','.js','.jsx','.css','.json','.mjs'}:
            if name in source.read_text('utf-8',errors='replace'):
                print('DEPENDENCY CONFLICT: source restored, new assets retained; '+str(source))
                sys.exit(3)
for row in new_rows:
    target=inside_root(row['File'])
    if digest(target)!=row['SHA256After']:
        raise RuntimeError('NEW FILE CHANGED — do not delete: '+row['File'])
    target.unlink()  # Exact eight task-owned files, no recursive deletion or directory removal.
result={'status':'SOURCE RESTORED / NEW TASK ASSETS REMOVED','restored':7,'removed':8,'technicalAndBrowserChecks':'REQUIRED AFTER RESTORE'}
(EVIDENCE/'actual-rollback-result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
