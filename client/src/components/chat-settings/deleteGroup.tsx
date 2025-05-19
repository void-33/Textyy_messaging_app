import { AccButtonLookalike } from "../ui/custom-accordion";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useSidebar } from "../ui/sidebar";
import { RoomType } from "@/utils/types";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import useToast from "../ui/Toast";
import useSelectedRoomState from "@/stores/selectedRoomStore";
import { CircleMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DialogDescription } from "@radix-ui/react-dialog";
import useRoomCardState from "@/stores/roomCardSrore";

type GroupDeleteButtonProps = {
  currRoom: RoomType | null;
};

const GroupDeleteButton = ({ currRoom }: GroupDeleteButtonProps) => {
  const protectedFetch = useProtectedFetch();
  const toast = useToast();
  const navigate = useNavigate();
  const clearSelectedRoom = useSelectedRoomState((state) => state.clearRoom);
  const deleteRoomCard = useRoomCardState((state) => state.deleteRoomCard);
  const setRecentlyDeletedRoomId = useRoomCardState(
    (state) => state.setRecentlyDeletedRoomId
  );
  const { setOpen } = useSidebar();

  const deleteGroup = async () => {
    const response = await protectedFetch(
      `/api/rooms/delete/${currRoom?._id}`,
      "DELETE"
    );
    if (response?.data.success) {
      toast("Group deleted successfully");
      clearSelectedRoom();
      setOpen(false);
      navigate("/chats", { replace: true });
      if (currRoom) {
        setRecentlyDeletedRoomId(currRoom?._id);
        deleteRoomCard(currRoom._id);
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <AccButtonLookalike className="w-full">
          <CircleMinus className="mr-4" />
          Delete Group
        </AccButtonLookalike>
      </DialogTrigger>
      <DialogContent className="w-fit px-15">
        <DialogHeader>
          <DialogTitle>Group Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the group?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-5 md:justify-center">
          <DialogClose asChild>
            <Button onClick={deleteGroup}>Yes</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button>No</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDeleteButton;
