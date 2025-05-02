// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api",
      {
        path: "/socket.io",
        transports: ["websocket"],
        autoConnect: true,
        withCredentials: true,
      }
    );
  }
  return socket;
};

export const initializeSocket = (token: string): void => {
  const socket = getSocket();
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};
