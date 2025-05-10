import { useSidebar } from "@/components/ui/sidebar";
import { EllipsisIcon } from "lucide-react";

export function ChatsInfoButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <EllipsisIcon onClick={toggleSidebar} className="hover:cursor-pointer" />
  );
}
