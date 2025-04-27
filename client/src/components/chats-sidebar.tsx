import { Input } from "./ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChatSidebar() {
  const arr = Array.from({ length: 100 }, (_, i) => i);
  return (
    <Card className="w-[30vw] my-2 hover:cursor-pointer">
      <CardHeader className="px-3">
        <CardTitle>
          <h1 className="scroll-m-20 text-xl font-bold tracking-tight lg:text-2xl">
            Chats
          </h1>
        </CardTitle>
        <Input type="text" placeholder="Search"></Input>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
            Pinned
          </h4>
          <div className="max-h-64 overflow-scroll w-full">
            {arr.map((index) => ( (index<10) &&
              <Card key={index} className="my-2 mr-2 hover:cursor-pointer">
                <CardHeader>
                  <h6 className="text-xs font-semibold tracking-tight lg:text-sm">
                    {" "}
                    Name
                  </h6>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 text-sm font-normal tracking-tight lg:text-sm text-gray-500">
            All Chats
          </h4>
          <div className="max-h-[40vh] overflow-scroll w-full">
            {arr.map((index) => (
              <Card key={index} className="my-2 mr-2">
                <CardHeader>
                  <h6 className="text-xs font-semibold tracking-tight lg:text-sm hover:cursor-pointer">
                    {" "}
                    Name
                  </h6>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
