"use client";
import React, { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Weight, FileText, User, Trash2Icon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { subscribeTokenToTopic } from "@/utils/wrapper/FCMWrapper";
import { toast } from "react-toastify";
import { MessageContext } from "@/utils/context/MessageContext";
import Cookies from "js-cookie";

export default function Page() {
  const [wasteData, setWasteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const { message } = useContext(MessageContext);
  const token = Cookies.get("token");
  const [wasteId, setwasteId] = useState("");
  useEffect(() => {
    if (fcmToken && wasteData.length > 0) {
      const userId = wasteId;
      console.log("FCM token waste:", fcmToken);
      subscribeTokenToTopic(fcmToken, `waste-${userId}`);
    }
  }, [fcmToken, wasteData]);

  // Handle incoming FCM messages
  useEffect(() => {
    if (message) {
      console.log("Message received: ", message);

      if (message.data?.topic.startsWith("waste-")) {
        const { topic, ...rest } = message.data;

        const newWaste = {
          id: rest.id,
          location: rest.location,
          description: rest.description,
          garbageType: rest.garbageType,
          garbageWeight: rest.garbageWeight,
          garbagePic: rest.garbagePic,
          longitude: rest.longitude,
          latitude: rest.latitude,
          user: {
            name: rest.userName, // Assuming the user name is included in the message
          },
        };

        // Add the new waste record to the UI
        setWasteData((prevData) => [newWaste, ...prevData]);

        // Show a toast notification
        toast.success(
          <div>
            <strong>New Waste Record Received:</strong>
            <p>{`Location: ${rest.location}, Type: ${rest.garbageType}`}</p>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else {
        console.log("Topic not matched");
        console.log("topic: ", message.data?.topic);
      }
    }
  }, [message]);

  // Fetch initial waste data
  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response1 = await fetch(`${url}/api/waste`, {
          headers: {
            Authorization: token,
          },
        });
        const response2 = await fetch(`${url}/api/waste/data/user`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response1.ok && !response2.ok) {
          throw new Error("Failed to fetch waste data");
        }
        const data = await response1.json();
        const data2 = await response2.json();
        setwasteId(data2.id);
        setWasteData(data);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteData();
  }, [token]);

  // Function to handle garbage collection (delete)
  const handleCollect = async (id) => {
    try {
      const response = await fetch(`${url}/api/waste/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filter out the collected garbage from the UI
        setWasteData((prevData) => prevData.filter((waste) => waste.id !== id));
        alert("Garbage collected successfully!");
      } else {
        alert("Failed to collect garbage. Please try again.");
      }
    } catch (error) {
      console.error("Error collecting garbage:", error);
      alert("An error occurred while collecting garbage.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Trash2Icon className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">আবর্জনা সংগ্রহ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার এলাকার আবর্জনা সংগ্রহ করুন এবং পরিচ্ছন্ন রাখুন।
        </p>

        <div className="min-h-screen bg-neutral-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteData.map((waste) => (
              <Card
                key={waste.id}
                className="w-full bg-white shadow-xl h-full flex flex-col"
              >
                <CardContent className="flex flex-col flex-grow space-y-6">
                  <div className="relative w-full">
                    <AspectRatio
                      ratio={20 / 12}
                      className="bg-neutral-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={waste.garbagePic}
                        alt="Garbage Collection"
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>

                  <div className="grid grid-cols-1 gap-4 flex-grow">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600">
                          অবস্থান
                        </p>
                        <p className="text-lg">{waste.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Weight className="h-5 w-5 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600">
                          ওজন
                        </p>
                        <p className="text-lg">{waste.garbageWeight} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600">
                          ধরন
                        </p>
                        <p className="text-lg">{waste.garbageType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-neutral-500" />
                      <div>
                        <p className="text-sm font-medium text-neutral-600">
                          ব্যবহারকারী
                        </p>
                        <p className="text-lg">{waste.user.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-neutral-600 mb-2">
                      বিবরণ
                    </h3>
                    <p className="text-neutral-800">{waste.description}</p>
                  </div>

                  {/* Button at the bottom */}
                  <div className="flex justify-center mt-auto">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleCollect(waste.id)}
                    >
                      সংগ্রহ করা হয়েছে
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
