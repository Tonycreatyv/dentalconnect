import { io } from "socket.io-client";

export const socket = io("http://159.223.124.111:3001", {
  transports: ["websocket"],
});
