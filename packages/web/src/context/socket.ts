import socketio from "socket.io-client";
import React from "react";

export const socket = socketio("http://localhost:8001");
export const SocketContext = React.createContext<any>(null);
