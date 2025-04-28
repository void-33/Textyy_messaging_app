import { io, Socket } from 'socket.io-client'
import { getAccessToken } from './accessToken';

let socket: Socket | null = null;

const initSocket = (url = 'http://localhost:3500') => {
    if (!socket)
        socket = io(url, {
            query: {
                accessToken: getAccessToken(),
            },
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 2000,
        });
};
const getSocket = () => {
    if (!socket)
        throw new Error('Socket is not initialized. Call initSocket to initialize socket');
    return socket;
}

const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export { initSocket, getSocket, disconnectSocket };