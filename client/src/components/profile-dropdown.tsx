import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authContext";
import useCurrUserState from "@/stores/currUserStore";

import { UserRoundPen } from "lucide-react";
import Settings from "./Settings";
import { useEffect, useState } from "react";

interface ProfileDropdownMenuProps {
  state: "expanded" | "collapsed";
}

export function ProfileDropdownMenu(props: ProfileDropdownMenuProps) {
  //state of sidebar either collapsed or exapanded
  const currUsername = useCurrUserState((state) => state.username);
  const { state } = props;
  const { logout } = useAuth();

  //state for tracking whether the dropdown menu is either open or closed
  const [dropDownOpen, setDropDownOpen] = useState(false);
  //state for tracking whether the Settingsdialog is either open or closed
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  useEffect(() => {
    if (settingsDialogOpen) {
      setDropDownOpen(false);
    }
  }, [settingsDialogOpen]);

  return (
    <>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <div>
            {state === "expanded" && (
              <Button variant="outline" className="hover:cursor-pointer w-full">
                Profile
              </Button>
            )}
            {state === "collapsed" && (
              <Button
                variant="outline"
                size="icon"
                className="hover:cursor-pointer"
              >
                <UserRoundPen className="hover:cursor-pointer" />
              </Button>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" aria-hidden="false">
          <DropdownMenuGroup>
            <DropdownMenuItem>{currUsername}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setSettingsDialogOpen(!settingsDialogOpen);
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Dark Mode</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={logout} className="hover:cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Settings
        dialogOpen={settingsDialogOpen}
        setDialogOpen={setSettingsDialogOpen}
      />
    </>
  );
}
