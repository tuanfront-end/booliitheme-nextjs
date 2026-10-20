# Redesign v2 — trang profile BooliiTheme (tối giản đúng nghĩa)

Ghi lại ngày 2026-10-20, sau Stop 3 của bản v1. Anh Tuấn không hài lòng với
bất kỳ section nào của trang chủ v1 và giao toàn quyền thiết kế lại từ đầu.

## Trạng thái

**Đang chờ.** Anh đang build một skill từ session "Skill design từ reference
images". Khi skill đó xong mới triển khai lại từ đầu, dùng skill đó. Trước lúc
ấy không dựng, không xoá gì.

Bản v1 vẫn nằm nguyên trên branch `redesign/soft-neutral` (commit cuối
`43efc12`). Khi bắt đầu v2: xoá toàn bộ section trang chủ v1
(`components/home/*`, phần mount trong `app/page.tsx`, các slot trên Switch)
rồi dựng lại.

## Yêu cầu của anh

1. **Không rút refs từ `design-refs/`.** Học thiết kế từ các ảnh trong
   `images/__/` (hiện có: `built-different.png`, `daily.png`, `hero.png`,
   `one-message.png`, `pricing.png`).
2. **Layout thông minh, hiện đại, sáng tạo và tối giản.** Không dựng kiểu
   layout đại trà, nhàm chán. Nếu chỉ nghĩ ra được layout quen tay thì đừng
   làm.
3. **Chỉ lấy gu style từ `soft-neutral`.** Bảng màu, hình khối, độ thoáng là
   của soft-neutral; bố cục không đi theo quy trình rút refs của site-brief.
4. **Mọi thứ tối giản nhất.** Không mô tả nhiều, không nhiều thông tin.
   Profile chỉ trả lời năm điều:
   1. Tôi là ai.
   2. Tôi làm gì: thiết kế và phát triển website, dùng AI để thiết kế website.
   3. Các template của tôi đẹp. Mỗi item **chỉ có ảnh, tên và giá**, không gì
      khác. Bấm vào một item thì mở template detail ra **như cách Dribbble
      làm** (một lớp nổi lên trên trang, không chuyển sang trang khác).
   4. Muốn có một cái của riêng mình thì nhắn cho tôi.
   5. Hoặc tôi làm thuê cho bạn nếu cần.

## Những gì v1 để lại vẫn dùng được

- Dữ liệu 10 sản phẩm và số liệu ThemeForest thật: `lib/data/projects.ts`
  (v2 chỉ cần tên, giá và ảnh).
- Logo mark "iB" (`components/site/logo-mark.tsx`), wordmark, favicon.
- Brand Ink đã khoá, nền near-white, font Geist một họ, bo container 24px, bo
  nút 12px (các lựa chọn của anh trên Switch ở Stop 2).
- Header và footer v1 nhiều thông tin (mega menu, 4 cột link). Với v2 tối
  giản thì cũng cần xem lại cho cùng tinh thần.
