import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useProtectedFetch from "@/hooks/useProtectedFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSearch from "./user-search";

export function ChatSidebar() {
  const protectedFetch = useProtectedFetch();
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Array<Record<string, string>>>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await protectedFetch("/api/user/getfriends", "GET");
      setFriends(response?.data.friends);
    };
    fetchFriends();
  }, []);


  const handleUserSelection= (username:string)=>{
    navigate(`/chats/${username}`);
  }


  return (
    <Card className="grow w-[30vw] my-2 hover:cursor-pointer flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle>
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Chats
          </h1>
        </CardTitle>
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></Input>
      </CardHeader>

      <CardContent className="grow px-2 flex flex-col overflow-hidden">
        {searchQuery.trim().length > 0 ? (<UserSearch searchQuery={searchQuery} />) : (
          <div className="grow flex flex-col overflow-auto">
            <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
              All Chats
            </h4>
            <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
              {friends.map((item) => {
                return (
                  <Card
                    key={item._id}
                    className="my-2 mr-2"
                    onClick={() => handleUserSelection(item.username)}
                  >
                    <CardHeader>
                      <h6 className="text-xs tracking-tight lg:text-sm hover:cursor-pointer">
                        {item.username}
                      </h6>
                    </CardHeader>
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
