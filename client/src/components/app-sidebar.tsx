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
  PhoneCall,
  Settings,
  UserPen,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import TextyyLogo from "../assets/owl.png";
import {
  AppSidebarMinimizeButton,
  AppSidebarMaximizeButton,
} from "./cusotomSidebarTriggers";

import { Switch } from "@/components/ui/switch";

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
  };

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
              <SidebarMenuButton asChild>
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
            <Switch onClick={toggleTheme} />
            <SidebarMenuButton asChild>
              <Link to="#">
                <UserPen />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
