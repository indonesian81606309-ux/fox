import { io } from 'socket.io-client';

let socket;
export const initSocket = (userId) => {
  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
    auth: { userId },
  });
  return socket;
};
export const getSocket = () => socket;
