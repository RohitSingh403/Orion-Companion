export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function showNotification(
  title: string,
  body: string
) {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    silent: false,
  });
}