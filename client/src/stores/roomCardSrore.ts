import { create } from "zustand";
import { RoomCardType } from "@/utils/types";

type RoomCardStateType = {
  roomCards: RoomCardType[];
  setRoomCards: (
    updater: RoomCardType[] | ((prev: RoomCardType[]) => RoomCardType[])
  ) => void;
  clearRoomCards: () => void;
  deleteRoomCard: (roomId: string) => void;
  renameRoomCard: (roomId: string, name: string) => void;
  recentlyDeletedRoomId: string;
  setRecentlyDeletedRoomId: (roomId: string) => void;
};

const useRoomCardState = create<RoomCardStateType>((set, get) => ({
  roomCards: [],
  setRoomCards: (updater) => {
    set((state) => ({
      roomCards:
        typeof updater === "function"
          ? (updater as (prev: RoomCardType[]) => RoomCardType[])(
              state.roomCards
            )
          : updater,
    }));
  },
  clearRoomCards: () => {
    set({ roomCards: [] });
  },
  deleteRoomCard: (roomId: string) => {
    const newRoomCards = get().roomCards.filter(
      (card) => card.roomId._id !== roomId
    );
    set({ roomCards: newRoomCards });
  },
  renameRoomCard: (roomId: string, name: string) => {
    const newCards = get().roomCards.filter((card) => {
      if (card.roomId._id === roomId) {
        card.name = name;
      }
      return card;
    });
    set({ roomCards: newCards });
  },
  recentlyDeletedRoomId: "",
  setRecentlyDeletedRoomId: (roomId: string) => {
    set({ recentlyDeletedRoomId: roomId });
  },
}));

export default useRoomCardState;
