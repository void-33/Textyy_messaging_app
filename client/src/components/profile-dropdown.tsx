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

import { UserRoundPen } from "lucide-react";

interface ProfileDropdownMenuProps {
  state: "expanded" | "collapsed";
}

export function ProfileDropdownMenu(props: ProfileDropdownMenuProps) {
  //state of sidebar either collapsed or exapanded
  const { state } = props;
  const { logout } = useAuth();

  return (
    <DropdownMenu>
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
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Dark Mode</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout} className="hover:cursor-pointer">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
