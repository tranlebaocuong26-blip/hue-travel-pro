# HUẾ TRAVEL PRO V2.3 — Mobile Check Link

- Project / Gate / Task: HUẾ TRAVEL PRO V2.3 / GATE07-01 / MOBILE-CHECK-LINK.
- Ngày: 24/10/2026.
- Phạm vi Owner: gửi link để kiểm tra trên điện thoại; không sửa UI/code.

## Executive Summary / công việc / root cause

IP Wi-Fi hiện tại của máy là `192.168.1.12`. Server cũ chỉ listen127.0.0.1:3000, nên điện thoại không thể truy cập. Đã dừng đúng server do Codex khởi động trong phiên và chạy lại lệnh dev sẵn có với `--hostname 0.0.0.0 --port 3000` để phục vụ kiểm tra cùng mạng Wi-Fi. Không đổi firewall/router, không triển khai Internet hoặc cài package.

Link Home: `http://192.168.1.12:3000/`; trang Về Huế: `http://192.168.1.12:3000/ve-hue`. Điện thoại cần cùng mạng Wi-Fi với laptop; máy tính và server phải tiếp tục chạy. IP có thể thay đổi khi đổi mạng.

## Kết quả / bằng chứng / giới hạn

Runtime Next14.2.35 báo Ready, server listen mạng thay vì chỉ loopback. Kiểm tra HTTP qua địa chỉ Wi-Fi được thực hiện trước khi gửi link. HTTP response chỉ xác nhận khả năng truy cập từ laptop; không phải bằng chứng giao diện đúng trên điện thoại, cũng không chứng nhận firewall/AP cho phép thiết bị khác.

## File changes / tests

NO SOURCE MODIFICATION. Chỉ tạo báo cáo này; dev server có thể cập nhật cache .next. Logo và các LOCK giữ nguyên.

- Typecheck / Build: NOT TESTED, không có thay đổi source.
- Runtime server start: PASS, có Ready và HTTP200 ở log.
- Visual Tests / truy cập từ điện thoại thật: NOT TESTED; Owner sẽ kiểm tra.

## Bước tiếp theo / nghiệm thu

Owner mở link bằng trình duyệt điện thoại cùng Wi-Fi. Nếu không mở được, cần kiểm tra kết nối thiết bị thực tế; chưa tự đổi bảo mật mạng. Trạng thái: LINK PROVIDED — AWAIT OWNER MOBILE CHECK.

**HARD STOP — AWAIT OWNER REVIEW.**
