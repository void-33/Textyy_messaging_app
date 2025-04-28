import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAccessToken } from "@/contexts/accessToken";
import { useAuth } from "@/contexts/authContext";
import axios from "axios";

import { UserRoundPen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileDropdownMenuProps {
  state: "expanded" | "collapsed";
}

export function ProfileDropdownMenu(props: ProfileDropdownMenuProps) {
  //state of sidebar either collapsed or exapanded
  const { state } = props;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3500/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        clearAccessToken();
        logout();
        navigate("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.message);
      }
    }
  };

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
          <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
