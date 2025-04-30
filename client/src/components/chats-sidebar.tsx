import { Input } from "./ui/input";
import useProtectedFetch from "@/hooks/useProtectedFetch";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ChatSidebar() {
  const protectedFetch = useProtectedFetch();
  const navigate = useNavigate();

  const [friends, setFriends] = useState<Array<Record<string, string>>>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    Array<Record<string, string>>
  >([]);
  const [sendingRequestTo, setSendingRequestTo] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await protectedFetch("/api/user/getfriends", "GET");
      setFriends(response?.data.friends);
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        const res = await protectedFetch(
          `/api/user/search?query=${searchQuery}`,
          "GET"
        );
        if (res?.data.users) {
          setSearchResults(res.data.users);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce input

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const sendFriendRequest = async (toUserId: string) => {
    setSendingRequestTo((prev)=>[...prev,toUserId]);
    try {
      const res = await protectedFetch("/api/friendrequest/send", "POST", {
        toUserId,
      });
      if (res?.data.success) {
        alert("Friend request sent");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "An error occurred");
    }
    setSendingRequestTo((prev)=>prev.filter(id=>id!== toUserId));
  };

  const handleUserSelection= (username:string)=>{
    navigate(`/chats/${username}`);
  }

  const currentFriendIds = new Set(friends.map((user) => user._id));
  const friendResults = searchResults.filter((u) =>
    currentFriendIds.has(u._id)
  );
  const otherResults = searchResults.filter(
    (u) => !currentFriendIds.has(u._id)
  );

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
        {searchQuery.trim().length > 0 ? (
          <div className="grow overflow-auto">
            <h4 className="text-sm text-gray-500 mb-1">{`Search Results: ${searchQuery}`}</h4>

            {friendResults.length > 0 && (
              <h4 className="text-sm text-gray-500 mb-1">Friends</h4>
            )}
            {friendResults.map((user) => (
              <Card
                key={user._id}
                className="my-2 p-3 flex items-center justify-between"
                onClick={()=>handleUserSelection(user.username)}
              >
                <span className="text-sm font-medium">{user.username}</span>
              </Card>
            ))}
            {otherResults.length > 0 && (
              <h4 className="text-sm text-gray-500 mb-1">Other Users</h4>
            )}
            {otherResults.map((user) => (
              <Card
                key={user._id}
                className="my-2 p-3 flex items-center justify-between"
              >
                <span className="text-sm font-medium">{user.username}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={sendingRequestTo.includes(user._id)}
                  onClick={() => sendFriendRequest(user._id)}
                >
                  {sendingRequestTo.includes(user._id) ? "Sending..." : "AddFriend"}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
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
