import { create } from "zustand";

interface Message {
  _id: string;
  sender: string;
  roomId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  messagesByRoom: Record<string, Message[]>;
  setMessages: (roomId: string, msgs: Message[]) => void;
  getMessages: (roomId: string) => Message[];
  addMessage: (roomId: string, msg: Message) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messagesByRoom: {},
  setMessages: (roomId: string, msgs: Message[]) =>
    set((state)=>({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]:msgs,
      }
    })),
  getMessages: (roomId:string) => {
    return get().messagesByRoom[roomId] || [];
  },
  addMessage: (roomId:string,msg: Message) =>
    set((state)=> (
      {messagesByRoom:{
        ...state.messagesByRoom,
        [roomId]: [...(state.messagesByRoom[roomId] || []),msg]
      }}
    )
    )
}));
