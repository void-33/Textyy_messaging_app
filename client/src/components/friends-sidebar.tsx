import { useState, useEffect } from "react";
import useProtectedFetch from "../hooks/useProtectedFetch";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserSearch from "@/components/user-search";

interface FriendType {
  _id: string;
  username: string;
  roomId: string;
}
const FriendsSidebar = () => {
  const protectedFetch = useProtectedFetch();
  const navigate = useNavigate();

  const [friends, setFriends] = useState<FriendType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unfriendingIds, setunfriendingIds] = useState<string[]>([]);
  const [unfriendedIds, setunfriendedIds] = useState<string[]>([]);
  const [sendingRequestIds, setSendingRequestIds] = useState<string[]>([]);
  const [sentRequestIds, setSentRequestIds] = useState<string[]>([]);
  const [cancellingReqIds, setCancellingReqIds] = useState<string[]>([]);
  const [requestIdMap, setRequestIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFriends = async () => {
      const friendRes = await protectedFetch("/api/user/getfriends", "GET");
      if (friendRes?.data.success) {
        setFriends(friendRes.data.friendsWithRoom);
      }
    };
    fetchFriends();
  }, [protectedFetch]);

  const unfriendUser = async (userId: string) => {
    setunfriendingIds((prev) => [...prev, userId]);
    navigate('/friends');
    const res = await protectedFetch(`/api/user/unfriend/${userId}`, "DELETE");
    if (res?.data.success) {
      const toastId = toast("Unfriended", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
      setunfriendedIds((prev) => [...prev, userId]);
    }
    setunfriendingIds((prev) => prev.filter((id) => id !== userId));
  };

  const sendFriendRequest = async (toUserId: string) => {
    setSendingRequestIds((prev) => [...prev, toUserId]);
    const res = await protectedFetch("/api/friendrequest/send", "POST", {
      toUserId,
    });
    if (res?.data.success) {
      const toastId = toast("Friend Request Sent", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
      setSentRequestIds((prev) => [...prev, toUserId]);
      setRequestIdMap({ ...requestIdMap, [toUserId]: res.data.requestId });
    }
    setSendingRequestIds((prev) => prev.filter((id) => id !== toUserId));
  };

  const cancelFriendRequest = async (reqId: string, toUserId: string) => {
    setCancellingReqIds((prev) => [...prev, reqId]);
    const res = await protectedFetch(
      `/api/friendrequest/cancel/${reqId}`,
      "DELETE"
    );
    if (res?.data.success) {
      const toastId = toast("Friend Request Canceled", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss(toastId),
        },
      });
      setSentRequestIds((prev) => prev.filter((id) => id !== toUserId));
      const updatedMap = { ...requestIdMap };
      delete updatedMap[toUserId];
      setRequestIdMap(updatedMap);
    }
    setCancellingReqIds((prev) => prev.filter((id) => id !== reqId));
  };

  const handleUserSelection = (roomId: string) => {
    navigate(`/friends/${roomId}`);
  };

  return (
    <Card className="grow w-[30vw] my-2 hover:cursor-pointer flex flex-col">
      <CardHeader className="px-3 shrink-0">
        <CardTitle>
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Friends
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
          <UserSearch searchQuery={searchQuery} />
        ) : (
          <div className="grow flex flex-col overflow-auto">
            <h4 className="shrink-0 scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
              All Friends
            </h4>
            <div className="grow overflow-scroll w-full scrollbar scrollbar-thumb-gray-400 scrollbar-thumb-rounded-xl scrollbar-w-1.5 dark:scrollbar-thumb-gray-700">
              {friends.length === 0 && (
                <p className="text-sm text-muted-foreground px-3 mt-2">
                  No Friends.
                </p>
              )}
              {friends.map((user) => {
                return (
                  <Card
                    key={user._id}
                    className="my-2 mr-2"
                    onClick={() => handleUserSelection(user.roomId)}
                  >
                    <CardHeader>
                      <h6 className="text-xs tracking-tight lg:text-sm hover:cursor-pointer">
                        {user.username}
                      </h6>
                    </CardHeader>
                    <CardContent>
                      {unfriendedIds.includes(user._id) ? (
                        <>
                          {sentRequestIds.includes(user._id) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={cancellingReqIds.includes(
                                requestIdMap[user._id]
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelFriendRequest(
                                  requestIdMap[user._id],
                                  user._id
                                );
                              }}
                            >
                              {cancellingReqIds.includes(requestIdMap[user._id])
                                ? "Cancelling..."
                                : "Cancel"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={sendingRequestIds.includes(user._id)}
                              onClick={(e) =>{e.stopPropagation(); sendFriendRequest(user._id)}}
                            >
                              {sendingRequestIds.includes(user._id)
                                ? "Adding..."
                                : "Add Friend"}
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={unfriendingIds.includes(user._id)}
                          onClick={(e) =>{e.stopPropagation(); unfriendUser(user._id)}}
                        >
                          {unfriendingIds.includes(user._id)
                            ? "Unfriending..."
                            : "Unfriend"}
                        </Button>
                      )}
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
};

export default FriendsSidebar;
