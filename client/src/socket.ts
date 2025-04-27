import { io, Socket } from 'socket.io-client'

let socket:Socket | null = null;

const initSocket = (url = 'http://localhost:3500') => {
    if(!socket)
        socket = io(url);
};
const getSocket = () => {
    if(!socket)
        throw new Error('Socket is not initialized. Call initSocket to initialize socket');
    return socket;
}

const disconnectSocket = ()=>{
    if(socket){
        socket.disconnect();
        socket = null;
    }
}

export { initSocket, getSocket, disconnectSocket };