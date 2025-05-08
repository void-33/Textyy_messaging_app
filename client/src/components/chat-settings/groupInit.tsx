import { useState } from "react";
import { Button } from "../ui/button";
import {
  // Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  // DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import FriendsScrollArea from "../ui/friendsScrollArea";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface UserType {
  _id: string;
  username: string;
}

interface AddGroupMembersProps {
  handleOnSubmit: (name: string, members: UserType[]) => void;
}

const GroupInit = ({ handleOnSubmit }: AddGroupMembersProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const [queuedToAdd, setQueuedToAdd] = useState<UserType[]>([]);

  const handleProceed = () => {
    handleOnSubmit(groupName, queuedToAdd);
  };

  return (
    // <Dialog>
    //   <DialogTrigger>
    //     <Button variant={"outline"} className="width-full">
    //       Click here
    //     </Button>
    //   </DialogTrigger>
    <DialogContent className="w-[25rem]">
      <DialogHeader>
        <DialogTitle>Group Name</DialogTitle>
        <DialogDescription>Enter your Group Name</DialogDescription>
      </DialogHeader>
      <Input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      ></Input>

      <Separator />

      <DialogHeader>
        <DialogTitle>Select Members</DialogTitle>
        <DialogDescription>
          Select friends to be added to the group
        </DialogDescription>
      </DialogHeader>
      <FriendsScrollArea
        queuedToAdd={queuedToAdd}
        setQueuedToAdd={setQueuedToAdd}
      />
      <DialogFooter className="flex flex-row sm:justify-around">
        <Button
          onClick={() => {
            setQueuedToAdd([]);
            setGroupName("");
          }}
        >
          Reset
        </Button>
        <Button onClick={handleProceed}>Proceed</Button>
      </DialogFooter>
    </DialogContent>
    // </Dialog>
  );
};

export default GroupInit;
