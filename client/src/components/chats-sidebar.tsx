import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import UserSearch from "./user-search";
import { CirclePlus, Delete } from "lucide-react";
import GroupInit from "./chat-settings/groupInit";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import useSocketStore from "@/stores/socketStore";

interface UserType {
  _id: string;
  username: string;
}
interface RoomType {
  _id: string;
  name: string;
}

type DMRoomCardType = {
  _id: string;
  name: string;
  isGroup: false;
  otherUser: UserType;
  lastMessage: string;
  lastMessageAt: Date;
};
type GroupRoomCardType = {
  _id: string;
  name: string;
  isGroup: true;
  groupId: RoomType;
  lastMessage: string;
  lastMessageAt: Date;
};

type RoomCardType = DMRoomCardType | GroupRoomCardType;

export function ChatSidebar() {
  const protectedFetch = useProtectedFetch();
  const getSocket = useSocketStore((state) => state.getSocket);
  const { messages } = useChatStore();
  const navigate = useNavigate();
  const { username } = useParams();

  const [roomCards, setRoomCards] = useState<RoomCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRoomCards = async () => {
      const response = await protectedFetch(
        "/api/roomcards/getroomcards",
        "GET"
      );
      const newCards: RoomCardType[] = response?.data.roomCards || [];
      setRoomCards((prevRoomCards) => {
        //create map of new cards by name for quick access
        const newCardsMap: Map<string, RoomCardType> = new Map(
          newCards.map((card: RoomCardType) => [card.name, card])
        );

        //replace prev cards with real ones only if name matches
        const prevUpdatedCards: RoomCardType[] = prevRoomCards.map(
          (card: RoomCardType) => {
            return newCardsMap.get(card.name) ?? card;
          }
        );

        // Add any new cards that didn't exist before
        const existingNames = new Set(
          prevUpdatedCards.map((card: RoomCardType) => card.name)
        );
        const additionalNewCards = newCards.filter(
          (card: RoomCardType) => !existingNames.has(card.name)
        );

        const combined = [...prevUpdatedCards, ...additionalNewCards];

        // Separate dummy and real cards
        const dummyCards = combined.filter((card: RoomCardType) =>
          card._id.startsWith("dummy")
        );
        const realCards = combined
          .filter((card: RoomCardType) => !card._id.startsWith("dummy"))
          .sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
          );

        return [...dummyCards, ...realCards];
      });
    };
    fetchRoomCards();
  }, [messages]);

  useEffect(() => {
    if (username) {
      const roomCardExists = roomCards.some((card) => card.name === username);
      if (!roomCardExists) {
        const newRoomCard: RoomCardType = {
          _id: `dummy-${Date.now()}`,
          name: username,
          isGroup: false,
          otherUser: { _id: "dummy_id", username },
          lastMessage: "",
          lastMessageAt: new Date(),
        };
        setRoomCards((prevRoomCards) => {
          const exists = prevRoomCards.some((c) => c.name === newRoomCard.name);
          if (exists) return prevRoomCards;
          return [newRoomCard, ...prevRoomCards];
        });
      }
    }
  }, [username, roomCards]);

  const handleCardSelection = (card: RoomCardType) => {
    // if (!card.isGroup) navigate(`/chats/${card.otherUser.username}`);
    // else navigate(`/chats/${card.name}`);
    navigate(`/chats/${card.name}`);
  };

  const newGroupCreation = (name: string, members: UserType[]) => {
    const group = { name, members };
    const socket = getSocket();
    socket.emit("joinGroup", group);

    const newRoomCard: RoomCardType = {
      _id: `${"dummy"}-${Date.now()}`,
      name,
      isGroup: true,
      groupId: { _id: "dummy_id", name },
      lastMessage: "",
      lastMessageAt: new Date(),
    };
    setRoomCards((prevRoomCards) => [newRoomCard, ...prevRoomCards]);
    navigate(`/chats/${name}`);
  };

  const isSelectedCard = (card: RoomCardType) => {
    return card.name === username;
  };

  return (
    <Card className="grow w-[30vw] my-2 flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle className="flex flex-row justify-between items-center">
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Chats
          </h1>
          <Dialog>
            <DialogTrigger>
              <CirclePlus className="hover:cursor-pointer" />
            </DialogTrigger>
            <GroupInit handleOnSubmit={newGroupCreation} />
          </Dialog>
        </CardTitle>
        <div className="flex flex-row justify-between gap-2 items-center">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></Input>
          <Delete
            className="hover:cursor-pointer"
            onClick={() => setSearchQuery("")}
          />
        </div>
      </CardHeader>

      <CardContent className="grow px-2 flex flex-col overflow-hidden">
        {searchQuery.trim().length > 0 ? (
          <UserSearch searchQuery={searchQuery} />
        ) : (
          <div className="grow flex flex-col overflow-auto">
            <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
              All Chats
            </h4>
            <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
              {roomCards.map((item) => {
                return (
                  <Card
                    key={item._id}
                    className={clsx(
                      "m-2 hover:cursor-pointer",
                      isSelectedCard(item) && "border border-primary"
                    )}
                    onClick={() => handleCardSelection(item)}
                  >
                    <CardHeader>
                      <h6 className="text-xs tracking-tight lg:text-sm">
                        {item.name}
                      </h6>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs">{item.lastMessage}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
