from PIL import Image
from pathlib import Path
p=Path(r'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\codex\evidence\GATE-07-02C-00')
Image.open(p/'ve-hue-timeline-1366.png').crop((288,278,977,737)).save(p/'P1-LS02-timeline-crop.png')
