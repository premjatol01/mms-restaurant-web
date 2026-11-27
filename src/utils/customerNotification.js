/**
 * Customer Order Notification Manager
 * Enables mobile lock-screen & browser notification popups for QR ordering customers.
 */

let swRegistration = null;

/**
 * Registers the service worker for background/lockscreen notification handling on mobile Chrome/Android.
 */
export async function registerCustomerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    swRegistration = reg;
    return reg;
  } catch (err) {
    console.warn("[CustomerNotification] Service Worker registration failed:", err.message);
    return null;
  }
}

/**
 * Checks if browser supports HTML5 notifications.
 */
export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Returns current browser notification permission: 'default' | 'granted' | 'denied'
 */
export function getCustomerNotificationPermission() {
  if (!isNotificationSupported()) return "denied";
  return Notification.permission;
}

/**
 * Requests notification permission from customer.
 */
export async function requestCustomerNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn("[CustomerNotification] Permission request failed:", err);
    return "denied";
  }
}

/**
 * Plays a pleasant synthesizer audio chime on order updates.
 */
export function playCustomerChime() {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    // Autoplay may be deferred until user interaction
  }
}

/**
 * Triggers a native mobile/desktop notification popup on customer's phone screen.
 * Works even when customer locks screen or switches to another app!
 */
export async function dispatchCustomerNotification({ title, body, icon, url, data = {} }) {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  // 1. Play gentle chime
  playCustomerChime();

  // 2. Try Service Worker first (required by Android Chrome for background & lockscreen popups)
  if (!swRegistration && "serviceWorker" in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.ready;
    } catch (e) {}
  }

  const notificationData = {
    type: "SHOW_ORDER_NOTIFICATION",
    title: title || "Order Status Update",
    body: body || "Your food order has an update!",
    icon: icon || "/window.svg",
    badge: "/window.svg",
    data: {
      url: url || (typeof window !== "undefined" ? window.location.href : "/"),
      ...data,
    },
  };

  if (swRegistration && swRegistration.active) {
    swRegistration.active.postMessage(notificationData);
    return;
  }

  // 3. Direct Notification fallback
  try {
    const n = new Notification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: [250, 100, 250, 100, 250],
      tag: "order-status-" + (data?.orderId || "update"),
      renotify: true,
      data: notificationData.data,
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch (err) {
    console.warn("[CustomerNotification] Direct notification failed:", err.message);
  }
}
