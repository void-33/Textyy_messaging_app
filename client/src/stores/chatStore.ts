import { create } from "zustand";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (msgs: Message[]) => set({ messages: msgs }),
  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));
