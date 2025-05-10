import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Contact,
  MessageCircle,
  MoonStarIcon,
  Settings,
  SunIcon,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import TextyyLogo from "../assets/owl.png";
import { ArrowLeftFromLineIcon, ExpandIcon } from "lucide-react";

import { useState } from "react";
import { ProfileDropdownMenu } from "./profile-dropdown";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  {
    title: "Chats",
    url: "/chats",
    icon: MessageCircle,
  },
  {
    title: "Friends",
    icon: Contact,
    url: "/friends",
  },
  {
    title: "FriendRequests",
    icon: UsersRound,
    url: "/friendrequest",
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const getTargetPath = (base: string) => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const roomId =
      pathParts[1] === "chats" || "friends" || "friendrequest"
        ? pathParts[1]
        : null;
    return roomId ? `/${base}/${roomId}` : `/${base}`;
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };
  const [theme, setTheme] = useState<String>("light");

  return (
    <Sidebar collapsible="icon" variant="floating" side="left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1">
            <img src={TextyyLogo} className="w-6 h-6"></img>
            <span className="text-lg lg:text-xl font-bold">Textyy</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="ml-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="pr-5 w-[98%] hover:border-1 hover:border-gray-400"
                onClick={() => navigate(getTargetPath(item.url.slice(1)))}
              >
                <div className="overflow-visible">
                  <item.icon />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="pr-5 w-[98%] hover:border-1 hover:border-gray-400"
            >
              <Link to="/settings" className="overflow-visible">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar}>
              {state === "expanded" ? (
                <ArrowLeftFromLineIcon />
              ) : (
                <ExpandIcon />
              )}
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              className="my-2 hover:cursor-pointer border-1 hover:border-gray-400 h-9"
            >
              {theme === "dark" ? <MoonStarIcon /> : <SunIcon />}
              <span>Toggle dark mode</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <ProfileDropdownMenu state={state} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
