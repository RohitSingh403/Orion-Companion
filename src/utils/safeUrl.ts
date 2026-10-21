const LINK = /^(https?:|mailto:)/i;
const IMAGE = /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i;

export function safeNoteLink(href: string | undefined | null) {
  if (!href) return undefined;
  const value = href.trim();
  return LINK.test(value) ? value : undefined;
}

export function safeNoteImage(src: string | undefined | null) {
  if (!src) return undefined;
  const value = src.trim().replace(/\s/g, "");
  if (value.length > 1_500_000 || !IMAGE.test(value)) return undefined;
  return value;
}
