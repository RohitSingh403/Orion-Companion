export function surfaceName() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("surface");
}

export function isSideSurface() {
  const surface = surfaceName();
  return surface === "mini" || surface === "companion";
}
