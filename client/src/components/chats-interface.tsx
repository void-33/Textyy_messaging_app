import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, Search, SendIcon } from "lucide-react";
import { ChatsInfoButton } from "@/components/cusotomSidebarTriggers";
import { Input } from "./ui/input";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { disconnectSocket, getSocket, initSocket } from "@/contexts/socket";

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
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    initSocket();
    const socket = getSocket();

    socket.on("connect", () => {
      alert(`Connected with socket id: ${socket.id}`);
    });

    socket.on('chatMessage',(msgdata)=>{
      setMessages((prev)=>[...prev,msgdata])
    })

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      const socket = getSocket();
      socket?.emit("chatMessage", inputText);

      setMessages((prev) => [...prev, inputText]);
      setInputText("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
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
                  <item.icon
                    key={item.title}
                    className="w-5 hover:cursor-pointer"
                  />
                ))}
                <ChatsInfoButton />
              </div>
            </CardContent>
          </Card>
          <div className="w-full my-2 h-[73vh] border-2 rounded-2xl"></div>
          <Card className="w-full mx-0.5 my-1">
            <CardContent>
              <form
                className="flex justify-between"
                onSubmit={handleSendMessage}
              >
                <Input
                  type="text"
                  placeholder="Write a message"
                  className="w-[95%]"
                  value={inputText}
                  onChange={handleInputChange}
                />
                <button type="submit">
                  <SendIcon className="mt-1 hover:cursor-pointer" />
                </button>
              </form>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
