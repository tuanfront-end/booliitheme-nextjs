# Lần siết v3: những quyết định khó thấy lý do

Ngày 2026-11-06, chạy skill `siet-template-truoc-khi-ban` trên v3 (site cá nhân,
không đóng gói bán). Chỉ ghi những chỗ về sau đọc code sẽ thấy lạ.

## Quyết định

- **`layout.tsx` tự khai báo Geist Serif bằng `localFont`** thay vì import
  `GeistSerif` từ `geist/font/serif`. Gói đó khai báo 5 mặt chữ trong một file và
  mỗi mặt đều được preload trên mọi route; bốn mặt (Regular, Square, Triangle,
  Heart) không có chỗ nào dùng, 183 KB mỗi trang. Đường dẫn trỏ vào
  `node_modules/geist/dist/fonts/`: nếu nâng `geist` đổi cấu trúc thư mục thì
  build sẽ báo ngay.
- **Lưới template trên home tách đôi:** thẻ render ở server (`template-card`),
  client chỉ giữ con trỏ "View" và nút mở rộng (`template-grid`); con trỏ chạy
  bằng một handler trên `<ul>`, không phải trên từng thẻ. Các bản dựng WordPress
  và Shopify nằm trong chunk tải khi bấm ô "Show all" (`template-rest`). Lý do:
  client import giá trị từ data layer kéo cả catalogue và 34 KB blur base64 vào
  chunk đầu của `/`.
- **`verbatimModuleSyntax` bật** để import type không thể tự biến thành import
  giá trị khi sửa một dòng — đúng lối mà data layer lọt vào client không ai hay.
- **Không đổi pixel:** mọi ảnh trong `images/` giữ nguyên định dạng PNG/JPEG.
  18 PNG (34 MB) chỉ nặng cho repo, không nặng cho người xem, vì Next phục vụ WebP.
  Chuyển định dạng đổi pixel và khó hoàn tác nên cần anh Tuấn gật.
- **Các mức contrast dưới AA được ghi tại chỗ** (`calendar.tsx`, `button.tsx`),
  không đổi màu: thiết kế thắng, và không mức nào qua ngưỡng lỗi (chữ làm việc
  dưới 3:1, hoặc bất kỳ chữ nào dưới 2:1).
- **Không làm:** đưa `Toaster` ra khỏi chunk sàn (7,7 KB gz, mọi route template
  đều dùng qua `ShareMenu`); `aria-current` trên ba nút tròn của header (cần
  chuyển header thành client chỉ để đánh dấu một trang); `themeColor` (đổi màu
  thanh trình duyệt trên điện thoại).
