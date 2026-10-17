import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000");

/**
 * Connects customer browser to Socket.io and joins the table room.
 * @param {string} tableId - The MongoDB _id or identifier of the verified table.
 * @param {object} callbacks - { onSessionUpdated, onSessionCompleted, onOrderCreated }
 */
export function connectTableSocket(tableId, callbacks = {}) {
  if (socket && socket.connected) {
    if (tableId) {
      socket.emit("join_table", { tableId });
    }
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    if (tableId) {
      socket.emit("join_table", { tableId });
    }
  });

  if (callbacks.onSessionUpdated) {
    socket.on("session:updated", callbacks.onSessionUpdated);
  }

  if (callbacks.onCustomerSynced) {
    socket.on("session:customer_synced", callbacks.onCustomerSynced);
  }

  if (callbacks.onFavoritesUpdated) {
    socket.on("session:favorites_updated", callbacks.onFavoritesUpdated);
  }

  if (callbacks.onSessionCompleted) {
    socket.on("session:completed", callbacks.onSessionCompleted);
  }

  return socket;
}

/**
 * Leaves the table room and disconnects socket.
 */
export function disconnectTableSocket(tableId) {
  if (socket) {
    if (tableId) {
      socket.emit("leave_table", tableId);
    }
    socket.disconnect();
    socket = null;
  }
}

/**
 * Returns active customer table socket.
 */
export function getTableSocket() {
  return socket;
}
