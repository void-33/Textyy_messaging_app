import { Card, CardContent } from "@/components/ui/card";
import { Video, Phone, Search, SendIcon, Settings } from "lucide-react";
import { ChatsInfoButton } from "@/components/customSidebarTriggers";
import { Input } from "./ui/input";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import useSocketStore from "@/stores/socketStore";
import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useParams } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import useCurrUserState from "@/stores/currUserStore";
import { ChatSettings } from "./chats-settings";
import useSelectedRoomState from "@/stores/selectedRoomStore";

type UserType = {
  _id: string;
  username: string;
};

type PrivateRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: false;
  otherUser: UserType;
};
type GroupRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: true;
};

type RoomType = PrivateRoomType | GroupRoomType;

interface Message {
  _id: string;
  sender: string;
  roomId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

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
export function ChatInterface() {
  const protectedFetch = useProtectedFetch();
  const { roomId } = useParams();
  
  const selectedRoom = useSelectedRoomState((state)=>state.room);
  const setSelectedRoom = useSelectedRoomState((state)=>state.setRoom);

  const setMessages = useChatStore((state) => state.setMessages);
  const messagesByRoom = useChatStore((state) => state.messagesByRoom);
  const getSocket = useSocketStore((state) => state.getSocket);
  const currUserId = useCurrUserState((state) => state.userId);

  const [inputText, setInputText] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomMessages = messagesByRoom[roomId ?? ""] ?? [];
  const messageCount = roomMessages.length;

  useEffect(() => {
    if (roomId) {
      const fetch = async () => {
        const response = await protectedFetch(
          `/api/rooms/getbyid/${roomId}`,
          "GET"
        );
        const roomObj: RoomType = response?.data.roomObj;
        if(!roomObj) return;

        setSelectedRoom(roomObj);

        if (messageCount) return;

        const res = await protectedFetch(
          `/api/messages/get/${roomObj._id}`,
          "GET"
        );
        setMessages(roomId, res?.data?.messages);
      };
      fetch();
    }
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current && messageCount) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [roomId, messageCount]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      const socket = getSocket();
      if (selectedRoom?._id) {
        socket?.emit("message", selectedRoom._id, inputText);
        setInputText("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  return (
    <>
      {selectedRoom?._id && (
        <Card className="w-full my-2 ml-2 mr-0 p-1">
          <CardContent className="pl-1 pr-2 h-full flex flex-col">
            <Card className="w-full mx-0.5 my-1">
              <CardContent className="flex justify-between">
                <h2 className="text-xs tracking-tight lg:text-sm">
                  {selectedRoom.name}
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
            <div className="w-full my-2 grow border-2 rounded-2xl overflow-auto flex flex-col">
              <div className="mt-auto"></div>
              {/* Load messages logic here */}
              {roomMessages.map((message: Message) => (
                <div
                  key={message._id}
                  className={`my-2 mx-4 flex flex-row ${
                    message.sender === currUserId
                      ? "justify-end"
                      : "justify-start"
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

      {!selectedRoom?._id && (
        <Card className="w-full my-2 ml-2 mr-0 p-1 flex justify-center">
          <CardContent className="flex h-[40%] flex-col items-center">
            <Settings size={150} strokeWidth={0.75} className="inline-block" />
            <h2 className="text-sm tracking-tight lg:text-xl">
              Select a Conversation to start chatting
            </h2>
          </CardContent>
        </Card>
      )}

      {/* chats settings sidebar */}
      <ChatSettings currRoom={selectedRoom} />
    </>
  );
}
