import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "../ui/dialog";
import { Input } from "../ui/input";

const RenameGroup = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button variant={"outline"}>Change Name</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Name</DialogTitle>
          <DialogDescription>Change your Group Name</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="New Group Name"
        ></Input>
        <Button>Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export default RenameGroup;
