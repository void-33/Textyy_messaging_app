import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeftFromLineIcon, ExpandIcon, EllipsisIcon } from "lucide-react";

export function ChatsInfoButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <EllipsisIcon onClick={toggleSidebar} className="hover:cursor-pointer" />
  );
}

export function AppSidebarMinimizeButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="hover:cursor-pointer ml-auto">
      <ArrowLeftFromLineIcon onClick={toggleSidebar} size={20}/>
    </div>
  );
}

export function AppSidebarMaximizeButton() {
  const { toggleSidebar } = useSidebar();
  return (
      <ExpandIcon onClick={toggleSidebar} size={20} className="ml-1.5 mt-2 hover:cursor-pointer"/>
  );
}
