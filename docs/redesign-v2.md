# Redesign v2 — trang profile BooliiTheme (tối giản đúng nghĩa)

> Đã thay bởi bản v3 trên Soft Neutral — xem `docs/adr/0002-back-to-soft-neutral.md`.

Ghi lại ngày 2026-10-20, sau Stop 3 của bản v1. Anh Tuấn không hài lòng với
bất kỳ section nào của trang chủ v1 và giao toàn quyền thiết kế lại từ đầu.

## Trạng thái

**Đang làm** trên nhánh `redesign/paper-hairline`. Skill là `paper-hairline`,
một house style cục bộ ở `.claude/skills/paper-hairline/` (ADR 0001). Thứ tự:
mở rộng nguồn học → đo trên ảnh → viết skill v0 → nối skill vào template cho
tới khi `npm run check` xanh → dựng v2. Nối xong mới dựng hay xoá gì của v1.

Bản v1 vẫn nằm nguyên trên branch `redesign/soft-neutral` (commit cuối
`43efc12`). Khi bắt đầu v2: xoá toàn bộ section trang chủ v1
(`components/home/*`, phần mount trong `app/page.tsx`, các slot trên Switch)
rồi dựng lại.

## Yêu cầu của anh

1. **Không rút refs từ `design-refs/`.** Học thiết kế qua skill
   `paper-hairline`; ảnh nguồn của nó (5 ảnh gru.ai từng ở `images/__/`, cộng
   các site cùng họ anh duyệt) nằm ở `.claude/skills/paper-hairline/refs/`.
2. **Layout thông minh, hiện đại, sáng tạo và tối giản.** Không dựng kiểu
   layout đại trà, nhàm chán. Nếu chỉ nghĩ ra được layout quen tay thì đừng
   làm.
3. **Gu style lấy từ `paper-hairline`** (thay soft-neutral từ 2026-10-20,
   ADR 0001). Bố cục không đi theo quy trình rút refs của site-brief.
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
- Brand Ink đã khoá (House rule 1 trong `brief.md`). Các lựa chọn khác ở
  Stop 2 của v1 (nền near-white, Geist một họ, bo 24/12) bỏ: v2 đi từ mặc định
  của paper-hairline, rồi Stop 2 của v2 chọn hue accent trong 3 ứng viên (không
  dùng hồng/đào, dấu ấn của gru.ai) và bộ font preset.
- Header và footer v1 nhiều thông tin (mega menu, 4 cột link). Với v2 tối
  giản thì cũng cần xem lại cho cùng tinh thần.
