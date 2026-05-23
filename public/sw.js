self.addEventListener("push", function (event) {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: "Executive Secretary",
      body: "You have a follow-up reminder."
    };
  }

  const title = data.title || "Executive Secretary";

  const options = {
    body: data.body || "You have a follow-up reminder.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: data.url || "/",
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );
});
