import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type SettingProps = {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Settings = ({ dialogOpen, setDialogOpen }: SettingProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>This is settings page</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <p>this is your settings</p>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
