// socket.manager.ts
import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocketManager = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_APP_URL, 
    },
  });
};

export const getSocketIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }
  return io;
};