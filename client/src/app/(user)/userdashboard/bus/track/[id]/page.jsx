"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { Map, Marker } from "pigeon-maps";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { subscribeTokenToTopic } from "@/utils/wrapper/FCMWrapper";
import { MessageContext } from "@/utils/context/MessageContext";
import { url } from "@/components/Url/page";
import { BusFront } from "lucide-react";

export default function UserDashboard() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fcmToken } = useFcmToken();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { message } = useContext(MessageContext);
  const [position, setPosition] = useState([23.8069, 90.3687]); // Default location
  const [placeName, setPlaceName] = useState("Loading location...");

  // Function to fetch place name
  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) throw new Error("Failed to fetch place name");
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Unknown location";
    }
  };

  // Fetch initial bus data
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${url}/api/bus/${id}`);
        if (!response.ok) throw new Error("Failed to fetch bus data");
        const data = await response.json();
        setBus(data);
        if (data.currentLatitude && data.currentLongitude) {
          setPosition([data.currentLatitude, data.currentLongitude]);
          const name = await fetchPlaceName(
            data.currentLatitude,
            data.currentLongitude
          );
          setPlaceName(name);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    fetchBus();
  }, [id]);

  // Subscribe to FCM topic for bus updates
  useEffect(() => {
    if (fcmToken) {
      console.log("FCM token bus:", fcmToken);
      subscribeTokenToTopic(fcmToken, `bus-${id}`);
    }
  }, [fcmToken, id]);

  // Check subscription status from local storage
  useEffect(() => {
    const subscribed =
      localStorage.getItem(`bus-${id}-notifications-subscribed`) === "true";
    setIsSubscribed(subscribed);
  }, [id]);

  // Handle real-time location updates via FCM messages
  useEffect(() => {
    if (message && message.data) {
      console.log("Received message:", message.data);

      // Parse latitude and longitude correctly
      const newLatitude = parseFloat(message.data.currentLatitude);
      const newLongitude = parseFloat(message.data.currentLongitude);

      if (!isNaN(newLatitude) && !isNaN(newLongitude)) {
        setBus((prevBus) => ({
          ...prevBus,
          currentLatitude: newLatitude,
          currentLongitude: newLongitude,
        }));
        setPosition([newLatitude, newLongitude]); // Update map marker position

        // Fetch and update place name
        fetchPlaceName(newLatitude, newLongitude).then((name) => {
          setPlaceName(name);
        });

        console.log(
          "Bus updated with new location:",
          newLatitude,
          newLongitude
        );
      } else {
        console.error("Invalid latitude/longitude received:", message.data);
      }
    }
  }, [message]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle user subscription to notifications
  const handleNotificationSubscription = async () => {
    if (!fcmToken) {
      console.error("FCM token not available");
      return;
    }

    try {
      if (isSubscribed) {
        localStorage.setItem(`bus-${id}-notifications-subscribed`, "false");
        setIsSubscribed(false);
        console.log("Unsubscribed from bus notifications");
      } else {
        await subscribeTokenToTopic(fcmToken, `bus-${id}-notifications`);
        localStorage.setItem(`bus-${id}-notifications-subscribed`, "true");
        setIsSubscribed(true);
        console.log("Subscribed to bus notifications");
      }
    } catch (error) {
      console.error("Error handling notification subscription:", error);
    }
  };

  return (
    <div className="p-9 space-y-2">
      <div className="flex gap-x-2 items-center text-black">
        <BusFront className="text-3xl" />
        <h1 className="text-2xl font-bold font-bangla">বাসের সময়সূচি</h1>
      </div>
      <p className="text-xs  border-black border-b-[2px] pb-4 font-bangla">
        বাস রুটের বিস্তারিত
      </p>
      <Card className=" border-2 overflow-hidden">
        <CardHeader>
          <h1 className="text-2xl font-bold ">
            {bus.busNum}: {bus.startPoint} → {bus.endPoint}
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="">
            <h2 className="text-xl font-semibold">Current Location</h2>
            <p className="">{placeName}</p>
          </div>

          <div className="mt-6 --8 rounded-lg">
            <Map
              height={400}
              defaultCenter={[23.8069, 90.3687]}
              defaultZoom={14}
            >
              <Marker anchor={position} color="red" />
            </Map>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleNotificationSubscription}
              className={`w-full max-w-md ${
                isSubscribed
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isSubscribed
                ? "Unsubscribe from Notifications"
                : "Subscribe to Notifications"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Bus Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start Point</span>
            <span>{bus.startPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">End Point</span>
            <span>{bus.endPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schedule</span>
            <span>{bus.schedule}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
