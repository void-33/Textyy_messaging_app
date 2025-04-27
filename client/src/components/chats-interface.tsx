import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, Search, SendIcon } from "lucide-react";
import { ChatsInfoButton } from "@/components/cusotomSidebarTriggers";
import { Input } from "./ui/input";

export function ChatInterface() {
  const icons = [
    {
      title: "Video Call",
      icon: Video,
    },
    {
      title: "Audio Call",
      icon: Phone,
    },
    {
      title: "Search chat",
      icon: Search,
    },
  ];
  return (
    <>
      <Card className="w-full my-2 ml-2 mr-0 p-1">
        <CardContent className="pl-1 pr-2">
          <Card className="w-full mx-0.5 my-1">
            <CardContent className="flex justify-between">
              <h2 className="text-xs font-normal tracking-tight lg:text-sm">
                UserName
              </h2>
              <div className="flex gap-10">
                {icons.map((item) => (
                  <item.icon className="w-5 hover:cursor-pointer" />
                ))}
                <ChatsInfoButton />
              </div>
            </CardContent>
          </Card>
          <div className="w-full my-2 h-[73vh] border-2 rounded-2xl"></div>
          <Card className="w-full mx-0.5 my-1">
            <CardContent className="flex justify-between">
              <Input type="text" placeholder="Write a message" className="w-[95%]" />
              <SendIcon className="mt-1 hover:cursor-pointer"/>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
