import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import useAccessTokenStore from "@/stores/accessTokenStore";

interface SocketState {
  socket: Socket | undefined;
  initSocket: (url?: string, force?: boolean) => Socket;
  getSocket: () => Socket;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: undefined,
  initSocket: (url = "http://localhost:3500", force = false) => {
    let accessToken = useAccessTokenStore.getState().getAccessToken();
    let existingSocket = get().socket;
    if (!existingSocket || force) {
      if (existingSocket) {
        existingSocket.disconnect(); // clean old
      }
      existingSocket = io(url, {
        query: {
          accessToken: accessToken,
        },
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000,
      });

      set({ socket: existingSocket });
    }
    return existingSocket;
  },
  getSocket: () => {
    let existingSocket = get().socket;
    if (!existingSocket) {
      existingSocket = get().initSocket();
    }
    return existingSocket;
  },
  disconnectSocket: () => {
    let existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.disconnect();
      set({ socket: undefined });
    }
  },
}));

export default useSocketStore;
