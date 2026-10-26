# GATE 07-03A — Isolated Typography Preview

Ngày 2026-10-25. Chỉ là mẫu thử; không import vào ứng dụng, không đổi logo hay font production.

Mở tại **http://192.168.1.12:3001/** khi máy chủ preview của phiên này còn chạy. Điện thoại cần cùng mạng với máy tính. Đây là server riêng cho thư mục preview, không thay server ứng dụng cổng 3000.

- A: chuỗi font hiện tại, gồm Geist + adjusted Arial; heading theo Segoe UI/Georgia; display Palatino/Times.
- B: UI/body Be Vietnam Pro; editorial/display Noto Serif.
- C: UI/body Noto Sans; editorial/display Noto Serif.

Chọn các nút bảng NFC/NFD để xem 29 chữ cái hoa/thường và 12 nguyên âm × 6 thanh × 2 kiểu chữ. Chọn NFC/NFD để đổi chuẩn hóa mẫu giao diện. Mức cỡ chữ 100/125/150% chỉ tăng kích thước mẫu, **không phải browser zoom**.

Tệp bắt đầu: `index.html`; cần phục vụ qua HTTP để nạp corpus JSON và font local. Bản HTML là mẫu so sánh font, không sao chép kích thước toàn bộ layout production. HUẾ TRAVEL PRO trong mẫu là text thử, không phải đề xuất thay logo đã LOCK.

Font lấy từ repository chính thức google/fonts; giữ nguyên tệp và OFL đi kèm. Không cài font vào hệ điều hành. Checksum và nguồn từng tệp: `../evidence/GATE-07-03A/preview-file-manifest.csv`.

Báo cáo: `../GATE-07-03A-VIETNAMESE-TYPOGRAPHY-DIAGNOSIS-REPORT.md`.

STOP — AWAIT OWNER FONT APPROVAL.
