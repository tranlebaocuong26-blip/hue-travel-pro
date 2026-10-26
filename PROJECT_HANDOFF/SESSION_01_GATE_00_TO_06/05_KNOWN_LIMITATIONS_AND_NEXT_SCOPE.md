# HUẾ TRAVEL PRO V2.3 — KNOWN LIMITATIONS & NEXT SCOPE
## CÁC GIỚI HẠN KỸ THUẬT TỒN TẠI & RANH GIỚI PHẠM VI TƯƠNG LAI

```
Tài liệu: 05_KNOWN_LIMITATIONS_AND_NEXT_SCOPE.md
Phiên làm việc: SESSION 01
Ngày lập: 22/10/2026
Quy tắc kiểm soát phạm vi: FIX ONLY WHAT FAILED — NO SCOPE CREEP
Trạng thái công việc tương lai: PROPOSED / NOT AUTHORIZED (CHƯA ĐƯỢC PHÊ DUYỆT)
```

---

## 1. GIỚI HẠN BẢO MẬT TỒN ĐỌNG BẮT BUỘC (MANDATORY OUTSTANDING ITEM)

### OUTSTANDING SECURITY ACCEPTANCE — D06-02

> [!IMPORTANT]
> **HẠNG MỤC NGOẠI LỆ NGHIỆM THU ĐÃ ĐƯỢC OWNER PHÊ DUYỆT TẠI GATE 06:**
> - **Mã tiêu chí:** `D06-02` (HTTPS PostgREST Data API Authenticated Access Evaluation).
> - **Trạng thái chính thức:** **`BLOCKED / NOT TESTED`**.
> - **Quyết định của Owner:** Owner đã chấp thuận `D06-02` là ngoại lệ nghiệm thu chuyển tiếp khi đóng và khóa có điều kiện GATE 06 vào ngày 22/10/2026.

#### 1.1 Nguyên nhân Kỹ thuật Tồn tại
- Trong cơ sở dữ liệu Supabase DEV (`rgoqdykpqyedambkrlvr`), bảng `auth.users` chứa đúng **0 dòng**.
- Hiện chưa có bất kỳ tài khoản người dùng kiểm thử nào được khởi tạo trên đám mây.
- Tuân thủ quy định cấm phát sinh thao tác ghi (`ZERO MUTATIONS`) và cấm tự ý tạo user trong giai đoạn Database Schema & Cloud Seed (GATE 06), đội ngũ kỹ thuật không tạo người dùng giả lập hay tự ký synthetic JWT tokens.

#### 1.2 Nghĩa vụ Nghiệm thu Chuyển tiếp Bắt buộc
1. **Kiểm thử lại bằng tài khoản thật:** Tiêu chí D06-02 bắt buộc phải được kiểm thử lại bằng tài khoản người dùng thực tế và JWT hợp lệ khi triển khai module **Authentication & Authorization** trong tương lai.
2. **Điều kiện tiên quyết:** Phải có văn bản/lệnh phê duyệt riêng của Owner về phạm vi khởi tạo tài khoản kiểm thử và cấu hình Auth.
3. **Tiêu chuẩn nghiệm thu:** Phải chứng minh rằng người dùng đã đăng nhập thông thường (standard authenticated user không có quyền admin) khi gửi request HTTPS GET kèm JWT hợp lệ tới các endpoint REST API:
   - `/rest/v1/content_items`
   - `/rest/v1/places`
   - `/rest/v1/rental_providers`
   - `/rest/v1/accommodations`
   - `/rest/v1/content_prices`
   - `/rest/v1/media_assets`
   sẽ **chỉ nhận về mảng rỗng `[]` (0 dòng)**, tuyệt đối không được đọc dữ liệu Draft hoặc media chưa xuất bản.
4. **Quy định ranh giới nghiêm ngặt:**
   - **Không** được sử dụng lệnh SQL nội bộ `SET ROLE authenticated;` để thay thế cho bài kiểm thử HTTP request kèm JWT thật qua API Gateway.
   - **Tuyệt đối không** được tự ý đánh dấu D06-02 thành `PASS` trước khi bài kiểm thử HTTPS thực tế hoàn thành và có bằng chứng xác nhận.

---

## 2. CÁC GIỚI HẠN KỸ THUẬT KHÁC CỦA PHIÊN SESSION 01

### 2.1 Chưa Tích hợp Dữ liệu Đám mây vào Frontend (Decoupled State)
- Giao diện Next.js (`src/app/*`) hiện đang tiêu thụ dữ liệu từ các file TypeScript tĩnh (`src/data/*.ts`).
- Chưa có mã nguồn Prisma Client gọi vào database Supabase trong các Server Components hay Server Actions.

### 2.2 Năm Bảng Non-Seed đang Rỗng (Protected Empty Tables)
- Các bảng: `areas`, `articles`, `content_revisions`, `audit_logs`, `admin_memberships` hiện có đúng `0` dòng trên Supabase DEV.
- Đây là trạng thái được bảo vệ có chủ ý trong GATE 06. Việc nạp dữ liệu cho các bảng này phải chờ các GATE nghiệp vụ chuyên biệt.

### 2.3 Chưa có Giao diện Quản trị Nội dung (Admin CMS)
- Chưa có giao diện biên tập để chuyển trạng thái từ `draft` sang `published`.
- Toàn bộ dữ liệu đám mây hiện đang ở chế độ nháp và được che giấu an toàn trước công chúng.

---

## 3. ĐỀ XUẤT PHẠM VI TƯƠNG LAI (PROPOSED / NOT AUTHORIZED)

> [!WARNING]
> Tất cả các hạng mục dưới đây **CHỈ LÀ ĐỀ XUẤT KỸ THUẬT (PROPOSED)**.
> **CHƯA ĐƯỢC OWNER CẤP QUYỀN THỰC THI (NOT AUTHORIZED)**.
> Tuyệt đối không tự ý xem các hạng mục này là phạm vi mặc định của GATE 07.

| Nhóm Công việc Đề xuất | Mô tả Kỹ thuật Đề xuất | Trạng thái Phê duyệt | Ràng buộc Thực thi |
|:---|:---|:---:|:---|
| **Module Authentication & RBAC** | Cấu hình Supabase Auth, thiết lập bảng `admin_memberships`, thực hiện kiểm thử D06-02 | `PROPOSED / NOT AUTHORIZED` | Chỉ thực hiện khi có Owner Directive riêng |
| **Data Layer Integration** | Tạo Prisma Client service layer, nối dữ liệu Supabase vào Next.js Server Components | `PROPOSED / NOT AUTHORIZED` | Chỉ thực hiện khi có Owner Directive riêng |
| **Taxonomy Area Population** | Nạp dữ liệu phân cấp hành chính vào bảng `areas` (TP. Huế, Hương Thủy, Hương Trà, Phú Lộc...) | `PROPOSED / NOT AUTHORIZED` | Chỉ thực hiện khi có Owner Directive riêng |
| **CMS Workflow & Publishing** | Xây dựng quy trình xuất bản dữ liệu từ `draft` sang `published` kèm ghi nhận `audit_logs` | `PROPOSED / NOT AUTHORIZED` | Chỉ thực hiện khi có Owner Directive riêng |
| **Production Deployment** | Triển khai Netlify Production, cấu hình biến môi trường và SSL custom domain | `PROPOSED / NOT AUTHORIZED` | Chỉ thực hiện khi có Owner Directive riêng |

---

*Hết nội dung giới hạn kỹ thuật. Mọi hành động tiếp theo phải chờ chỉ thị mới của Owner.*
