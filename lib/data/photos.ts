// Every photograph on the site, by what is in the frame. A buyer swaps a
// picture by changing one id here. Each loads from its photographer's CDN
// rather than shipping in the download, free to use under the Unsplash
// Licence; replace them with your own before you launch.

export type Photo = { src: string; alt: string; width: number; height: number };

const unsplash = (id: string, w = 2400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// `width` and `height` are the photograph's own, so next/image reserves the
// right box before it loads.
const photo = (id: string, alt: string, width: number, height: number): Photo => ({
  src: unsplash(id),
  alt,
  width,
  height,
});

export const photos = {
  // v2osk on Unsplash — https://unsplash.com/@v2osk
  mistOverQuiraing: photo(
    "photo-1470071459604-3b5ec3a7fe05",
    "Mist rolling over the Quiraing ridge on the Isle of Skye at sunrise, a road winding through the valley below",
    7372,
    4392,
  ),
} satisfies Record<string, Photo>;
