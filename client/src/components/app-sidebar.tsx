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
  MessageCircle,
  MoonStarIcon,
  PhoneCall,
  Settings,
  SunIcon,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import TextyyLogo from "../assets/owl.png";
import {
  AppSidebarMinimizeButton,
  AppSidebarMaximizeButton,
} from "./customSidebarTriggers";

import { useState } from "react";
import { ProfileDropdownMenu } from "./profile-dropdown";

const items = [
  {
    title: "Chats",
    url: "#",
    icon: MessageCircle,
  },
  {
    title: "Groups",
    url: "#",
    icon: UsersRound,
  },
  {
    title: "Call log",
    url: "#",
    icon: PhoneCall,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();

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
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1"
            >
              <Link to="#">
                <img src={TextyyLogo} className="w-6 h-6"></img>
                {state === "expanded" && (
                  <span className="text-lg lg:text-xl font-bold">Textyy</span>
                )}
                {state === "expanded" && <AppSidebarMinimizeButton />}
              </Link>
            </SidebarMenuButton>
            {state === "collapsed" && <AppSidebarMaximizeButton />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="ml-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="pr-5 w-[98%] hover:border-1 hover:border-gray-400"
              >
                <a href={item.url} className="overflow-visible">
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              className="my-2 hover:cursor-pointer border-1 hover:border-gray-400 h-9"
            >
              {theme === "dark" ? <MoonStarIcon /> : <SunIcon />}
              <span>Toggle dark mode</span>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <ProfileDropdownMenu state={state} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
