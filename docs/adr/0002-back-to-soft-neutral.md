# Bản v3 quay về Soft Neutral

Ngày 2026-11-05 anh Tuấn yêu cầu dựng lại trang profile hoàn toàn mới bằng
skill `soft-neutral`, theo bốn ảnh tham chiếu (header nút tròn, lưới ô kiểu
contribution graph, footer email lớn, lưới dự án hai cột), cực kỳ tối giản, chữ
đọc 14px, bộ font Geist Sans / Geist Serif / Geist Mono. Thay ADR 0001.

## Consequences

- `app/globals.css` và kit (`button`, `drawer`, `section-heading`) lấy lại bản
  soft-neutral của chính repo trước commit `73b3a2b`; `npm run check` chạy lại
  `palette-check` và `type-check` của soft-neutral.
- Hai luật của Soft Neutral được waive có lý do trong `.soft-neutral.json`:
  chữ 14px ngoài product object, và Geist Mono trên kicker.
- Switch (scaffolding dev) không còn mount: nó ép font và màu của v2.
- `.claude/skills/paper-hairline/` giữ nguyên làm lịch sử, không còn được load.
