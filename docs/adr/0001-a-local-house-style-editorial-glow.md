# Template chạy trên một house style cục bộ: editorial-glow

booliitheme v2 chạy trên `editorial-glow` thay cho Soft Neutral. Đây là một
house style ngang hàng, học từ ảnh gru.ai và vài site cùng họ, khác Soft Neutral
ở gần như mọi trục: nền giấy trắng, serif biên tập, ô ghép chia bằng kẻ mảnh,
một accent cộng một vầng sáng. Skill sống cục bộ ở
`.claude/skills/editorial-glow/` cho tới khi anh Tuấn thấy nó đáng vào house;
khi đó mới chuyển sang `claude-build-template-skills`, kèm ADR và thuật ngữ
**House style** sửa bên đó.

## Considered Options

- **Viết thẳng vào repo skill.** Mọi template khác nhận luật chưa ai thử trên
  một template thật. ADR 0013 bên đó cũng đã từ chối "a second house style"
  khi tham chiếu chỉ khác ở màu.
- **Fork nguyên soft-neutral.** Chép hàng nghìn dòng máy móc dùng chung (copy,
  SEO, switch, interact…) chỉ để thay phần giao diện, rồi các bản chép lệch dần.
- **Giữ checker của soft-neutral, waive các luật vướng.** Waiver đúng những luật
  lõi thì check không còn bảo vệ gì.

## Consequences

- Skill pipeline (site-brief, audit, canvas…) và `soft-neutral/` là chỉ đọc từ
  repo này, và vẫn gọi tên soft-neutral. `AGENTS.md` đổi hướng chúng sang
  editorial-glow, và nêu danh sách file soft-neutral còn được đọc.
- Symlink `.claude/skills/soft-neutral` ở lại: các checker dùng chung vẫn chạy
  từ đó, và `.soft-neutral.json` giữ tên vì chúng đọc nó.
- Checker riêng của style được fork vào `editorial-glow/scripts/`: `_dials`,
  `palette-check`, `brand-hue`, `write-check`, `type-check`, `hover-check`,
  `controls-check`. Các bản fork lệch dần với upstream; chấp nhận trong lúc
  skill còn cục bộ.
- Ảnh tham chiếu đi cùng skill ở `editorial-glow/refs/` chứ không vào
  `design-refs/`, nên rời bản bán cùng `.claude/`.
