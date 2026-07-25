export function playSound(file: string) {
  const audio = new Audio(`/sounds/${file}`);
  audio.volume = 0.4;
  audio.play().catch(() => {
    // Ignore autoplay errors
  });
}