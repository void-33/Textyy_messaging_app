import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";
import UserSearch from "./user-search";
import { CirclePlus, Delete } from "lucide-react";
import GroupInit from "./chat-settings/groupInit";
import { Dialog, DialogTrigger } from "./ui/dialog";

import useSocketStore from "@/stores/socketStore";
import useToast from "./ui/Toast";

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
  roomId: RoomType;
  otherUser: UserType;
  lastMessage: string;
  lastMessageAt: Date;
};
type GroupRoomCardType = {
  _id: string;
  name: string;
  isGroup: true;
  roomId: RoomType;
  lastMessage: string;
  lastMessageAt: Date;
};

type RoomCardType = DMRoomCardType | GroupRoomCardType;

export function ChatSidebar() {
  const protectedFetch = useProtectedFetch();
  const toast = useToast();
  const getSocket = useSocketStore((state) => state.getSocket);
  const messagesByRoom = useChatStore((state) => state.messagesByRoom);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [roomCards, setRoomCards] = useState<RoomCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const joinRooms = useCallback((roomcard: RoomCardType[]) => {
    const socket = getSocket();
    roomcard.forEach((card) => {
      socket.emit("joinRoom", card.roomId._id);
    });
  },[getSocket])

  const fetchRoomCards = useCallback(async () => {
    const response = await protectedFetch("/api/roomcards/getroomcards", "GET");
    const newCards: RoomCardType[] = response?.data.roomCards || [];

    setRoomCards((prevRoomCards) => {
      const newCardIds = new Set(newCards.map((card)=>card._id));
      const tempCards = prevRoomCards.filter((card) => !newCardIds.has(card._id));
      return [...tempCards, ...newCards];
    });

    joinRooms(newCards);
  },[joinRooms,protectedFetch])

  useEffect(() => {
    fetchRoomCards();
  }, [getSocket, messagesByRoom, fetchRoomCards]);

  useEffect(() => {
    if (!roomId) return;

    const roomCardExists = roomCards.some((card) => card.roomId._id === roomId);

    if(!roomCardExists){
      const fetchRoomcardbyId = async () => {
        const response = await protectedFetch(
          `/api/roomcards/getbyid/${roomId}`,
          "GET"
        );
        if (response?.data.success) {
          const newRoomCard = response.data.roomCardObj;

          setRoomCards((prevRoomCards) => {
            const exists = prevRoomCards.some(
              (c) => c.roomId._id === newRoomCard.roomId._id
            );
            if (exists) return prevRoomCards;
            return [newRoomCard, ...prevRoomCards];
          });
          const socket = getSocket();
          socket.emit('joinRoom',newRoomCard.roomId._id)
        } else {
          navigate("/chats");
        }
      };
      fetchRoomcardbyId();
    }
  }, [roomId,getSocket,navigate,protectedFetch,roomCards]);

  const handleCardSelection = (card: RoomCardType) => {
    // if (!card.isGroup) navigate(`/chats/${card.otherUser.username}`);
    // else navigate(`/chats/${card.name}`);
    navigate(`/chats/${card.roomId._id}`);
  };

  const newGroupCreation = async (name: string, members: UserType[]) => {
    //this function runs when Proceed button is pressed on group creation dialog
    const body = {
      name,
      members,
    };
    const response = await protectedFetch("/api/rooms/create", "POST", body);
    if (response?.data.success) {
      const room = response?.data.room;
      toast("Group creation successfull");
      await fetchRoomCards();
      navigate(`/chats/${room._id}`)
    }
  };

  const isSelectedCard = (card: RoomCardType) => {
    return card.roomId._id === roomId;
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
