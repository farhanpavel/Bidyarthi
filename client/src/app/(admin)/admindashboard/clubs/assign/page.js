"use client";
import React, { useState, useEffect } from "react";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ListPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";

export default function Page() {
  const [user, setUser] = useState([]);
  const [assignedUser, setAssignedUser] = useState(null);

  return (
    <div className="p-9 space-y-2">
      <div className="flex gap-x-2 items-center text-black">
        <ListPlus className="text-3xl" />
        <h1 className="text-2xl font-bold">Entry</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4">
        Create a perfect roadmap for your learning
      </p>
      <Card className="border-[1px] border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg">Manage Hall</CardTitle>
          <CardDescription className="text-xs">
            Manage the Hall access for the provost.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="w-1/3">
              <Card>
                <CardHeader>
                  <div className="py-3 text-[#4a4a4a] flex justify-between text-xs border-b-[1px] border-gray-300">
                    <div>
                      <h1>Select Hall To</h1>
                    </div>
                    <div>
                      <h1>Assign</h1>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.map((data) => (
                    <h1
                      className="text-xs flex items-center justify-between text-[#4a4a4a] border-b-[1px] border-gray-200 py-3"
                      key={data.provost_id}
                    >
                      {data.user?.name}{" "}
                      <Button
                        className="h-8 w-8 hover:bg-black hover:text-white hover:transition-all hover:delay-100 hover:duration-100"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAssign(data.provost_id)}
                        disabled={!!assignedUser}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </h1>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="w-1/3">
              <Card>
                <CardHeader>
                  <div className="py-3 text-[#4a4a4a] flex justify-between text-xs border-b-[1px] border-gray-300">
                    <div>
                      <h1>Remove</h1>
                    </div>
                    <div>
                      <h1>From Hall</h1>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {assignedUser && assignedUser.user && (
                    <h1 className="text-xs flex items-center justify-between text-[#4a4a4a] border-b-[1px] border-gray-200 py-3">
                      <Button
                        onClick={handleRemove}
                        className="h-8 w-8 hover:bg-black hover:text-white hover:transition-all hover:delay-100 hover:duration-100"
                        variant="ghost"
                        size="icon"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {assignedUser.user.name}
                    </h1>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
