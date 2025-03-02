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
import { useParams } from "next/navigation";

export default function Page() {
  const [user, setUser] = useState([]);
  const [assignedUser, setAssignedUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/user/Busdriver/deactive`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    };

    const assignData = async () => {
      const response = await fetch(`${url}/api/user/Busdriver/${id}/active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAssignedUser(data);
      }
    };

    fetchData();
    assignData();
  }, []);

  const handleAssign = async (user_id) => {
    try {
      const response = await fetch(`${url}/api/bus/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        alert("Failed to assign provost");
      } else {
        // Update state in real-time
        const userToAssign = user.find((u) => u.id === user_id);
        if (userToAssign) {
          setAssignedUser(userToAssign); // Move user to assigned box
          setUser((prevUsers) => prevUsers.filter((u) => u.id !== user_id)); // Remove user from unassigned box
        }
        alert("Success");
      }
    } catch (err) {
      console.error("Error assigning provost:", err);
    }
  };

  const handleDelete = async (user_id) => {
    try {
      const response = await fetch(`${url}/api/bus/${user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!response.ok) {
        alert("Failed to unassign provost");
      } else {
        // Update state in real-time
        if (assignedUser) {
          setUser((prevUsers) => [...prevUsers, assignedUser]); // Move user back to unassigned box
          setAssignedUser(null); // Clear assigned user
        }
        alert("Success");
      }
    } catch (err) {
      console.error("Error unassigning provost:", err);
    }
  };

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
                      key={data.id}
                    >
                      {data.name}{" "}
                      <Button
                        className="h-8 w-8 hover:bg-black hover:text-white hover:transition-all hover:delay-100 hover:duration-100"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAssign(data.id)}
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
                  {assignedUser && (
                    <h1 className="text-xs flex items-center justify-between text-[#4a4a4a] border-b-[1px] border-gray-200 py-3">
                      <Button
                        onClick={() => handleDelete(assignedUser.id)}
                        className="h-8 w-8 hover:bg-black hover:text-white hover:transition-all hover:delay-100 hover:duration-100"
                        variant="ghost"
                        size="icon"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {assignedUser.name}
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
