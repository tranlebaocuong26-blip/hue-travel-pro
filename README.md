# HUẾ TRAVEL PRO — HƯỚNG DẪN DỰ ÁN V2.3

> **Huế có chi hay?** — Cẩm nang du lịch Huế dành cho khách du lịch tự túc.

## 1. Công nghệ sử dụng
- **Framework:** Next.js 14 (App Router) + React 18
- **Ngôn ngữ:** TypeScript (chế độ strict mode)
- **Styling:** Tailwind CSS 3.4
- **Biểu tượng:** Lucide React
- **Quản lý gói:** pnpm v12+

## 2. Hệ Design Tokens màu chuẩn (Master Spec Section 3.3)
- `lavender`: `#C2C6FA` (Nền chuẩn ban đầu)
- `deep-violet`: `#4D3087` (Panel / menu / nhận diện thương hiệu)
- `soft-purple`: `#9075F4` (Tương tác phụ)
- `electric-lime`: `#CAFA35` (Accent tiết chế)
- `off-white`: `#FAFAFC` (Card nội dung)
- `dark-ink`: `#251C39` (Nội dung chính)
- `warm-gold`: `#F2C675` (Accent ấm)
- `warm-ivory`: `#FFF9F2` (Card / nền ấm)

## 3. Cấu trúc Route chuẩn (LOCK-01)
- `/`: Trang chủ (Landing + Floating preview deck)
- `/ve-hue`: Giới thiệu Huế, di sản, mốc 01/01/2025 Huế trực thuộc Trung ương
- `/kham-pha`: Di tích danh thắng, camping, biển & nghỉ dưỡng
- `/cam-nang`: Cẩm nang di chuyển, thuê xe máy (VNĐ/xe/ngày)
- `/luu-tru`: Homestay, khách sạn (VNĐ/phòng/đêm)
- `/tim-kiem`: Tìm kiếm toàn trang (Global Search)

## 4. Hướng dẫn cài đặt & chạy thử (Local Development)

### Cài đặt dependencies
```bash
pnpm install
```

### Chạy môi trường phát triển (Development)
```bash
pnpm dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### Kiểm tra TypeScript & Linting
```bash
pnpm run lint
```

### Đóng gói ứng dụng (Production Build)
```bash
pnpm build
```

### Chạy bản Production sau khi build
```bash
pnpm start
```
