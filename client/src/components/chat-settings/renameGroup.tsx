import { CaseSensitive } from "lucide-react";
import { AccButtonLookalike } from "../ui/custom-accordion";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { RoomType } from "@/utils/types";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import useToast from "../ui/Toast";
import useSelectedRoomState from "@/stores/selectedRoomStore";

type GroupRenameButtonProps = {
  currRoom: RoomType | null;
};

const GroupRenameButton = ({ currRoom }: GroupRenameButtonProps) => {
  const [inputText, setInputText] = useState<string>("");
  const protectedFetch = useProtectedFetch();
  const toast = useToast();
  const setSelectedRoom = useSelectedRoomState((state) => state.setRoom);

  const handleSubmit = async () => {
    const roomId = currRoom?._id;
    const body = {
      roomId,
      newName: inputText,
    };
    if (roomId) {
      const response = await protectedFetch("/api/rooms/rename", "PATCH", body);
      if (response?.data.success) {
        setInputText("");
        toast("Group Successfully renamed");
        setSelectedRoom(response.data.room);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <AccButtonLookalike className="w-full">
          <CaseSensitive className="mr-4" />
          Rename Group
        </AccButtonLookalike>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>Enter the Group Name</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="New Group Name"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></Input>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupRenameButton;
