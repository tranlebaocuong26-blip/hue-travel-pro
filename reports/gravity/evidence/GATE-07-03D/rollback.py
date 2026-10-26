"""
GATE 07-03D Rollback Script
Restores src/app/page.tsx and src/components/navigation/AdaptiveNavigation.tsx
from checkpoint-before.
"""
import os
import sys
import shutil
import hashlib

BASE_DIR = r"A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro"
CHK_BEFORE = os.path.join(BASE_DIR, r"reports\gravity\evidence\GATE-07-03D\checkpoint-before")
TARGET_FILES = [
    r"src\app\page.tsx",
    r"src\components\navigation\AdaptiveNavigation.tsx"
]

EXPECTED_BEFORE_HASHES = {
    r"src\app\page.tsx": "54E41B72E5F92FA5B3FFEF440069FDC7A1E38B45F4AAFFE491FAF4E1E222F860",
    r"src\components\navigation\AdaptiveNavigation.tsx": "C8956693A1EADA727D65970A2BE73309AF5E681C1BD73844B1653EBC027D81CD"
}

def get_sha256(path):
    if not os.path.exists(path):
        return None
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().upper()

def main():
    is_execute = "--execute" in sys.argv
    print(f"=== GATE 07-03D ROLLBACK TOOL ({'EXECUTE' if is_execute else 'DRY RUN'}) ===")
    
    all_ok = True
    for rel in TARGET_FILES:
        src_path = os.path.join(CHK_BEFORE, rel)
        dst_path = os.path.join(BASE_DIR, rel)
        
        if not os.path.exists(src_path):
            print(f"[FAIL] Checkpoint backup missing: {src_path}")
            all_ok = False
            continue
            
        src_hash = get_sha256(src_path)
        expected = EXPECTED_BEFORE_HASHES.get(rel)
        if src_hash != expected:
            print(f"[FAIL] Hash mismatch for backup {rel}: got {src_hash}, expected {expected}")
            all_ok = False
            continue
            
        dst_hash = get_sha256(dst_path)
        print(f"[OK] Backup valid for {rel}")
        print(f"     Backup hash:  {src_hash[:16]}...")
        print(f"     Current hash: {dst_hash[:16]}...")
        
        if is_execute:
            shutil.copy2(src_path, dst_path)
            new_hash = get_sha256(dst_path)
            if new_hash == expected:
                print(f"[RESTORED] {rel} successfully restored to baseline hash.")
            else:
                print(f"[ERROR] Restore verification failed for {rel}!")
                all_ok = False
        else:
            print(f"     [DRY RUN] Would copy {src_path} -> {dst_path}")

    if not all_ok:
        print("\nROLLBACK STATUS: FAILED CHECKS")
        sys.exit(1)

    if not is_execute:
        print("\nDRY RUN PASS — NO WRITES PERFORMED")
        print("To execute full rollback, pass --execute")
    else:
        print("\nROLLBACK COMPLETED SUCCESSFULLY — Files restored to Gate 07-03C baseline.")

if __name__ == "__main__":
    main()
