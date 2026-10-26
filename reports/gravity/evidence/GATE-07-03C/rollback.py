#!/usr/bin/env python3
"""
GATE 07-03C Rollback Script
Usage:
  python rollback.py          # Dry-run (verifies hashes, NO WRITES)
  python rollback.py --apply  # Live rollback (restores baseline files, deletes new fonts)
"""
import sys, os, csv, hashlib, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
EVIDENCE = Path(__file__).resolve().parent
MANIFEST_PATH = EVIDENCE / 'manifest.csv'
CHECKPOINT_BEFORE = EVIDENCE / 'checkpoint-before'

def sha256_file(path: Path) -> str:
    if not path.is_file():
        return ''
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()

def main():
    apply_mode = '--apply' in sys.argv
    print(f"=== GATE 07-03C ROLLBACK ({'LIVE APPLY' if apply_mode else 'DRY RUN'}) ===")

    if not MANIFEST_PATH.exists():
        print(f"ERROR: Manifest not found at {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        manifest = list(reader)

    conflicts = []
    actions = []

    for row in manifest:
        rel_path = row['File'].replace('\\', '/')
        file_path = ROOT / rel_path
        h_before = (row['SHA256Before'] or '').strip()
        h_after = (row['SHA256After'] or '').strip()
        existed_before = row['ExistedBefore'].lower() == 'true'
        changed = row['Changed'].lower() == 'true'

        current_hash = sha256_file(file_path)

        if not changed:
            # File was not modified in 07-03C
            if current_hash != h_after:
                conflicts.append(f"UNTOUCHED FILE DRIFT: {rel_path} current={current_hash} expected={h_after}")
            continue

        if existed_before:
            # File existed before and was modified
            backup_path = CHECKPOINT_BEFORE / rel_path
            backup_hash = sha256_file(backup_path)

            if current_hash != h_after:
                conflicts.append(f"CURRENT HASH MISMATCH: {rel_path} current={current_hash} expected={h_after}")
            if backup_hash != h_before:
                conflicts.append(f"BACKUP HASH MISMATCH: {rel_path} backup={backup_hash} expected={h_before}")

            actions.append(('RESTORE', file_path, backup_path, h_before))
        else:
            # New font/license file added in 07-03C
            if current_hash != h_after:
                conflicts.append(f"NEW FILE HASH MISMATCH: {rel_path} current={current_hash} expected={h_after}")
            actions.append(('DELETE', file_path, None, None))

    if conflicts:
        print("CONFLIC DETECTED — ABORTING ROLLBACK:")
        for c in conflicts:
            print("  - " + c)
        sys.exit(1)

    print(f"Verified {len(manifest)} manifest entries. Planned actions: {len(actions)}")
    for act, target, src, expected in actions:
        if act == 'RESTORE':
            print(f"  [RESTORE] {target.relative_to(ROOT)} <- {src.relative_to(ROOT)} (target SHA: {expected})")
        elif act == 'DELETE':
            print(f"  [DELETE]  {target.relative_to(ROOT)}")

    if not apply_mode:
        print("\nDRY RUN PASS — NO WRITES PERFORMED.")
        print("To apply live rollback, run with --apply flag.")
        sys.exit(0)

    print("\n--- APPLYING LIVE ROLLBACK ---")
    for act, target, src, expected in actions:
        if act == 'RESTORE':
            target.write_bytes(src.read_bytes())
            restored_hash = sha256_file(target)
            assert restored_hash == expected, f"Restore verification failed for {target}"
            print(f"  RESTORED: {target.relative_to(ROOT)} -> {restored_hash}")
        elif act == 'DELETE':
            if target.exists():
                target.unlink()
                print(f"  DELETED:  {target.relative_to(ROOT)}")

    print("\nRollback complete. Now run: pnpm exec tsc --noEmit && pnpm lint && pnpm build")

if __name__ == '__main__':
    main()
