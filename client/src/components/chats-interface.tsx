import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, Search, SendIcon, Settings } from "lucide-react";
import { ChatsInfoButton } from "@/components/customSidebarTriggers";
import { Input } from "./ui/input";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { getSocket } from "@/contexts/socket";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useParams } from "react-router-dom";
import {useChatStore} from "@/store/chatStore"

export function ChatInterface() {
  const protectedFetch = useProtectedFetch();
  const { username } = useParams();

  const {messages, setMessages} = useChatStore();

  const [inputText, setInputText] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (username) {
      const fetch = async () => {
        try {
          const response = await protectedFetch(
            `/api/user/getidbyusername/${username}`,
            "GET"
          );
          const userId = response?.data.userId;
          setSelectedUserId(response?.data.userId);

          const socket = getSocket();
          if (userId && socket.connected) {
            socket.emit("joinRoom", userId);
          }
          if (userId) {
            const response = await protectedFetch(
              `/api/message/get/${userId}`,
              "GET"
            );
            setMessages(response?.data?.messages);
          }
        } catch (err: any) {
          alert(err.response.data.message || "Some error occured");
        }
      };
      fetch();
    } 
  }, [username]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      const socket = getSocket();
      if (selectedUserId) {
        socket?.emit("chatMessage", selectedUserId, inputText);
        setInputText("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  return (
    <>
      {selectedUserId && (
        <Card className="w-full my-2 ml-2 mr-0 p-1">
          <CardContent className="pl-1 pr-2">
            <Card className="w-full mx-0.5 my-1">
              <CardContent className="flex justify-between">
                <h2 className="text-xs tracking-tight lg:text-sm">UserName</h2>
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
            <div className="w-full my-2 h-[73vh] border-2 rounded-2xl overflow-auto flex flex-col ">

            <div className="mt-auto"></div>
              {/* Load messages logic here */}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`my-2 mx-4 flex flex-row ${
                      message.sender === selectedUserId
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <Card className="w-fit h-fit">
                      <CardContent>
                        <p>{message.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {/* Empty div to scroll to  */}
                <div ref={messagesEndRef} />
              </div>
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
      )}

      {!selectedUserId && (
        <Card className="w-full my-2 ml-2 mr-0 p-1 flex justify-center">
          <CardContent className="flex h-[40%] flex-col items-center">
            <Settings size={150} strokeWidth={0.75} className="inline-block" />
            <h2 className="text-sm tracking-tight lg:text-xl">
              Select a Conversation to start chatting
            </h2>
          </CardContent>
        </Card>
      )}
    </>
  );
}
