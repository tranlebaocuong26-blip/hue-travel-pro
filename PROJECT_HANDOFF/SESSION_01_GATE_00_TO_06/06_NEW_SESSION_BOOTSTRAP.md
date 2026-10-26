# HUẾ TRAVEL PRO V2.3 — NEW SESSION BOOTSTRAP GUIDE
## HƯỚNG DẪN KHỞI ĐỘNG NHANH DÀNH CHO PHIÊN GRAVITY TIẾP THEO

```
Tài liệu: 06_NEW_SESSION_BOOTSTRAP.md
Đối tượng: Gravity AI Coding Assistant (Phiên làm việc tiếp theo)
Thời điểm áp dụng: Ngay khi bắt đầu SESSION 02
Trạng thái dự án: GATE 00–05 LOCKED | GATE 06 CONDITIONAL PASS & LOCKED
Nguyên tắc tối thượng: PASS = LOCK — FIX ONLY WHAT FAILED — NO SCOPE CREEP
```

---

## 1. TÓM TẮT TRẠNG THÁI HIỆN TẠI

1. **Dự án:** HUẾ TRAVEL PRO V2.3 ("Huế có chi hay?") — Cổng thông tin du lịch Huế hiện đại.
2. **Giao diện Frontend:** Đã hoàn thành và đóng băng qua GATE 00–05. Giao diện đang hiển thị mock data từ `src/data/*.ts`.
3. **Cơ sở dữ liệu Đám mây (Supabase DEV):**
   - Đã tạo 22 bảng public, 19 RLS policies, 5 deferred subtype triggers (GATE 06B).
   - Đã nạp thành công 20 bản ghi seed (260 dòng trên 17 bảng) bằng 1 giao dịch duy nhất (GATE 06C-C2).
   - 5 bảng non-seed (`areas`, `articles`, `content_revisions`, `audit_logs`, `admin_memberships`) được bảo vệ nghiêm ngặt ở đúng `0` dòng.
   - Toàn bộ 20 content items đều ở trạng thái `draft`; 6 media assets đều ở trạng thái `is_published = false`.
4. **Trạng thái Nghiệm thu GATE 06:**
   - **CONDITIONAL PASS & LOCKED** (Phê duyệt ngày 22/10/2026).
   - Đạt **28 / 29 tiêu chí PASS**.
   - Ngoại lệ duy nhất: **D06-02 (BLOCKED / NOT TESTED)** — Được Owner chấp thuận là ngoại lệ chuyển tiếp sang GATE Authentication tương lai.

---

## 2. DANH SÁCH CÁC GATE ĐÃ KHÓA & NƠI TÌM ARTIFACTS GỐC

| Gate ID | Tên Hạng mục | Trạng thái | Thư mục Chứa Artifacts Gốc |
|:---:|:---|:---:|:---|
| **GATE 00** | Project Bootstrap & Branding | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\HUE_TRAVEL_PRO_V2.3_GRAVITY_MASTER_SPEC.md` |
| **GATE 01** | Navigation & Homepage | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_1\` |
| **GATE 02** | 4 Feature Pages UI | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_2\` |
| **GATE 03** | Continuous Hero-to-Sidebar Motion | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_3\` |
| **GATE 04** | 20 Source Records in TypeScript | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\src\data\` (`places.ts`, `rentals.ts`, `accommodations.ts`) |
| **GATE 05** | Final UI Freeze & Verification | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_5\` |
| **GATE 06A** | Relational Domain Modeling (22 Tables) | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6\GATE-06A-SPEC.md` |
| **GATE 06B** | DDL Migration V5 (Prisma & Supabase) | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\prisma\schema.prisma`<br>`A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\prisma\migrations\20261021201500_init_22_tables\migration.sql` |
| **GATE 06C-A**| Source Inventory & Decision Mapping | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6C\GATE-06C-A-DATA-MAPPING.md` |
| **GATE 06C-B**| Local Seed Script & Local Test Harness | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6C\GATE-06C-B-SEED.sql` |
| **GATE 06C-C1**| Cloud Seed Preflight Package V4 | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6C\connection_security.py`<br>`A:\trí tuệ nhân tạo\BAI_3\GATE_6C\verify_and_run_cloud_seed.py` |
| **GATE 06C-C2**| Supabase DEV Single Transaction Execution | **LOCKED** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6C\GATE-06C-C2-EXECUTION-REPORT.md` |
| **GATE 06C-D**| Final Data & Security Acceptance Audit | **CONDITIONAL LOCK** | `A:\trí tuệ nhân tạo\BAI_3\GATE_6C\GATE-06C-D-FINAL-ACCEPTANCE-CHECKLIST.md`<br>`A:\trí tuệ nhân tạo\BAI_3\GATE_6C\GATE-06C-D-GATE-06-CLOSURE-REPORT.md` |

---

## 3. CÁC QUYẾT ĐỊNH CỦA OWNER BẮT BUỘC BẢO TOÀN

1. **OD-01 (Hotline):** Giá trị rỗng/thiếu của đơn vị thuê xe phải là placeholder chuẩn: `'Chưa cập nhật'`.
2. **OD-02 (Địa chỉ):** Giữ nguyên văn địa chỉ từ source frontend, không được tùy tiện cắt ngắn hay viết tắt.
3. **OD-03 (Brand):** Đơn vị thuê xe không có thương hiệu riêng thì `brand = name`.
4. **OD-04 (Loại lưu trú):** Tuyệt đối không dùng `'hotel'`; chuẩn hóa thành `'khach-san'` (cùng `'homestay'`, `'resort'`).
5. **FIX 05 (Trigger hoãn):** 5 trigger subtype phải là `DEFERRABLE INITIALLY DEFERRED`.
6. **FIX 06 (`p3` Đồi Thiên An):** Giá tiền phải là `price_type = 'unknown'` và `is_free = false`.
7. **Quyết định Phương án A (22/10/2026):** Khóa có điều kiện GATE 06 với ngoại lệ D06-02 BLOCKED/NOT TESTED; chuyển nghĩa vụ kiểm thử D06-02 sang GATE Authentication. Không tự ý mở GATE 07.

---

## 4. NHỮNG VIỆC TUYỆT ĐỐI KHÔNG ĐƯỢC LÀM (HARD STOP)

> [!CAUTION]
> Bất kỳ hành động nào dưới đây đều cấu thành vi phạm kỷ luật kỹ thuật của dự án:
> 1. **KHÔNG** tự ý mở hoặc bắt đầu triển khai GATE 07 khi chưa có lệnh riêng từ Owner.
> 2. **KHÔNG** sửa đổi mã nguồn ứng dụng, giao diện frontend, CSS hoặc component.
> 3. **KHÔNG** sửa đổi `schema.prisma` hoặc tạo migration mới (V6).
> 4. **KHÔNG** chạy lại seed trên Supabase DEV hoặc PostgreSQL local.
> 5. **KHÔNG** tự ý tạo user, can thiệp vào `auth.users`, hay tạo mock JWT tokens.
> 6. **KHÔNG** chuyển trạng thái bản ghi từ `draft` sang `published`.
> 7. **KHÔNG** tự ý đổi tiêu chí D06-02 thành `PASS`.
> 8. **KHÔNG** di chuyển, đổi tên, ghi đè hay xóa các artifact đã LOCKED.

---

## 5. QUY TRÌNH 10 BƯỚC CHO MỌI GATE TỪ SESSION 02

Bắt đầu từ phiên tiếp theo, mọi GATE bắt buộc phải tuân thủ nghiêm ngặt quy trình 10 bước:
1. **Nhận lệnh riêng:** Chỉ bắt đầu khi có Owner Directive chỉ rõ Gate ID và phạm vi cấp phép.
2. **Kiểm tra ranh giới:** Xác nhận không chạm vào các artifact đã LOCKED của các Gate trước.
3. **Thực hiện đúng phạm vi:** Chỉ làm đúng những gì được giao — Không scope creep, không tự ý "tiện tay sửa thêm".
4. **Kiểm thử độc lập:** Thu thập log thực thi thực tế, không dùng log giả lập.
5. **Trình Owner nghiệm thu:** Báo cáo minh bạch kết quả (PASS / FAIL / BLOCKED).
6. **Khóa artifact:** Tính toán và đối chiếu mã băm SHA-256 các file nghiệm thu.
7. **Tạo Gate Closure Record:** Lập biên bản đóng Gate.
8. **Cập nhật Locked Artifacts Register:** Thêm các file mới vào danh mục khóa.
9. **Cập nhật Session Context:** Cập nhật ngữ cảnh bàn giao.
10. **Chờ chỉ đạo mới:** Dừng lại và chờ lệnh cho Gate tiếp theo.

---

STOP — AWAIT OWNER INSTRUCTION. NO GATE 07 AUTHORIZATION.
