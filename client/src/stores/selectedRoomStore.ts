import { create } from "zustand";
import { RoomType } from "@/utils/types";

type selectedRoomStateType = {
  room: RoomType | null;
  setRoom: (room: RoomType) => void;
  clearRoom: () => void;
};

const useSelectedRoomState = create<selectedRoomStateType>((set) => ({
  room: null,
  setRoom: (room: RoomType) => {
    set({ room: room });
  },
  clearRoom: () => {
    set({ room: null });
  },
}));

export default useSelectedRoomState;
