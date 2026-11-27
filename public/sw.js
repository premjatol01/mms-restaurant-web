/**
 * Service Worker for Tablly Customer Ordering Portal
 * Handles native mobile lock-screen & notification tray order status alerts.
 */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from client web page to show order notifications
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_ORDER_NOTIFICATION") {
    const { title, body, icon, badge, data } = event.data;
    
    const notificationPromise = self.registration.showNotification(title || "Order Update", {
      body: body || "Your order status has been updated",
      icon: icon || "/window.svg",
      badge: badge || "/window.svg",
      vibrate: [250, 100, 250, 100, 250],
      tag: "tablly-order-" + (data?.orderId || "status"),
      renotify: true,
      data: data || {},
    });

    event.waitUntil(notificationPromise);
  }
});

// Handle notification tap / click from mobile lock-screen or status bar
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open the ordering portal URL
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
