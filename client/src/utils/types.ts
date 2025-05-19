export type UserType = {
  _id: string;
  username: string;
};

export type PrivateRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: false;
  otherUser: UserType;
};
export type GroupRoomType = {
  _id: string;
  name: string;
  members: UserType[];
  isGroup: true;
};

export type RoomType = PrivateRoomType | GroupRoomType;

export type DMRoomCardType = {
  _id: string;
  name: string;
  isGroup: false;
  roomId: RoomType;
  otherUser: UserType;
  lastMessage: string;
  lastMessageAt: Date;
};
export type GroupRoomCardType = {
  _id: string;
  name: string;
  isGroup: true;
  roomId: RoomType;
  lastMessage: string;
  lastMessageAt: Date;
};

export type RoomCardType = DMRoomCardType | GroupRoomCardType;
