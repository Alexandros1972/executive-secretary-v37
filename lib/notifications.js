export async function requestNotificationPermission() {
  if (typeof window === "undefined") {
    return { ok: false };
  }

  if (!("Notification" in window)) {
    return {
      ok: false,
      message: "Notifications not supported"
    };
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return {
      ok: false,
      message: "Permission denied"
    };
  }

  return {
    ok: true,
    message: "Notifications enabled"
  };
}

export function showLocalNotification(title, body) {
  if (typeof window === "undefined") return;

  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icon-192.png"
  });
}

export function checkDueFollowUps(items = []) {
  const today = new Date().toISOString().slice(0, 10);

  const overdue = items.filter(
    (item) =>
      item.follow_up_date &&
      item.follow_up_date <= today &&
      item.status !== "completed"
  );

  return {
    total: overdue.length,
    overdue
  };
}

export async function registerServiceWorker() {
  if (typeof window === "undefined") return null;

  if (!("serviceWorker" in navigator)) return null;

  return await navigator.serviceWorker.register("/sw.js");
}
