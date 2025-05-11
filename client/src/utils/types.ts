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
