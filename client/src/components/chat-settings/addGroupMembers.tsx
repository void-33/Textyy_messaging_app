import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import FriendsScrollArea from "../ui/friendsScrollArea";

interface UserType {
  _id: string;
  username: string;
}

const AddGroupMembers = () => {
  const [queuedToAdd, setQueuedToAdd] = useState<UserType[]>([]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="width-full">
          Click here
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[25rem]">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Add Group Members from your friends
          </DialogDescription>
        </DialogHeader>
        <FriendsScrollArea
          queuedToAdd={queuedToAdd}
          setQueuedToAdd={setQueuedToAdd}
        />
        <DialogFooter className="flex flex-row sm:justify-around">
          <Button onClick={()=>setQueuedToAdd([])}>Reset</Button>
          <Button >Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupMembers;
