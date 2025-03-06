"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { subscribeTokenToTopic } from "@/utils/wrapper/FCMWrapper";
import { getMessaging, onMessage } from "firebase/messaging";
import firebaseApp from "@/utils/firebase/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { MessageContext } from "@/utils/context/MessageContext";
import { url } from "@/components/Url/page";

export default function Page() {
  const { id } = useParams(); // Get the `id` from the URL
  const [bus, setBus] = useState(null); // State to store the fetched bus data
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  // Check notification subscription status on mount
  const [isSubscribed, setIsSubscribed] = useState(false); // State to manage notification subscription
  const [showToast, setShowToast] = useState(false); // State to control toast display
  const { message } = useContext(MessageContext);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${url}/api/bus/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bus data");
        }
        const data = await response.json();
        setBus(data); // Set the fetched bus data
        setLoading(false); // Set loading state to false
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    fetchBus();
  }, [id]);

  useEffect(() => {
    if (fcmToken) {
      console.log("FCM token bus:", fcmToken);
      // Subscribe to a topic
      subscribeTokenToTopic(fcmToken, `bus-${id}`);
    }
  }, [fcmToken]);

  useEffect(() => {
    // Set a timer to allow toast notifications after 2 seconds
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  // useEffect(() => {
  //     if (bus && showToast) {
  //         console.log("Bus data updated:", bus);
  //         toast.success(
  //             <div>
  //                 <strong>{`Bus Update: ${bus.busNum}: (${bus.startPoint} → ${bus.endPoint})`}</strong>
  //                 <p>{`Bus ${bus.busNum}: (${bus.startPoint} → ${bus.endPoint}) is now at ${bus.currentLocation}`}</p>
  //             </div>
  //             , {
  //                 position: "top-right",
  //                 autoClose: 3000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //             });
  //     }
  // }, [bus]);

  useEffect(() => {
    const subscribed =
      localStorage.getItem(`bus-${id}-notifications-subscribed`) === "true";
    setIsSubscribed(subscribed);
  }, [id]);

  useEffect(() => {
    if (message) {
      console.log("AnotherComponent received message:", message);
      if (message.data) {
        if (message.data.topic) {
          if (message.data.topic === `bus-${id}`) {
            setBus((prevBus) => ({
              ...prevBus,
              currentLocation: message.data.currentLocation,
            })); // Update the bus data
            console.log("Bus updated with new location");
          } else {
            console.log("Topic not matched");
            console.log("topic: ", message.data.topic);
          }
        } else {
          console.log(message.data.topic);
        }
      }
    }
  }, [message]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  // Handle notification subscription/unsubscription
  const handleNotificationSubscription = async () => {
    if (!fcmToken) {
      console.error("FCM token not available");
      return;
    }

    try {
      if (isSubscribed) {
        // Unsubscribe from the notification topic
        //await unsubscribeTokenFromTopic(fcmToken, `bus-${id}-notifications`);
        localStorage.setItem(`bus-${id}-notifications-subscribed`, "false");
        setIsSubscribed(false);
        console.log("Unsubscribed from bus notifications");
      } else {
        // Subscribe to the notification topic
        await subscribeTokenToTopic(fcmToken, `bus-${id}-notifications`);
        localStorage.setItem(`bus-${id}-notifications-subscribed`, "true");
        setIsSubscribed(true);
        console.log("Subscribed to bus notifications");
      }
    } catch (error) {
      console.error("Error handling notification subscription:", error);
    }
  };

  // Extract location names from the comma-separated routeName
  const locations = bus.routeName.split(",").map((location) => location.trim());

  // Find the index of the current location
  const currentLocationIndex = locations.indexOf(bus.currentLocation);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex gap-x-2 items-center text-black">
        <h1 className="text-2xl font-bold">Bus Route Tracker</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
        Track the real-time location of the bus.
      </p>

      {/* Bus Details Card */}
      <Card className="bg-[#202020] border-none overflow-hidden">
        <CardHeader>
          <h1 className="text-2xl font-bold text-white">
            {bus.busNum}: {bus.startPoint} → {bus.endPoint}
          </h1>
          <p className="text-gray-300">Route: {bus.routeName}</p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="text-white">
            <h2 className="text-xl font-semibold">Current Location</h2>
            <p className="text-gray-300">{bus.currentLocation}</p>
          </div>

          {/* Dot-Connect UI for Bus Route */}
          <div className="mt-6 bg-black p-8 rounded-lg">
            <ol className="relative border-s border-gray-600 mx-auto max-w-md">
              {locations.map((location, index) => (
                <li key={index} className="mb-10 ms-6">
                  {/* Dot with Icon */}
                  <span
                    className={`absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-black ${
                      index === currentLocationIndex
                        ? "bg-green-500 dark:bg-green-500"
                        : "bg-blue-500 dark:bg-blue-500"
                    }`}
                  >
                    <svg
                      className={`w-2.5 h-2.5 ${
                        index === currentLocationIndex
                          ? "text-white dark:text-white"
                          : "text-white dark:text-white"
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </span>

                  {/* Location Name */}
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                    {location}
                    {/* Current Location Chip */}
                    {index === currentLocationIndex && (
                      <span className="bg-green-500 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm ms-3">
                        Current Location
                      </span>
                    )}
                  </h3>
                </li>
              ))}
            </ol>
          </div>

          {/* Subscribe to Notifications Button */}
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

      {/* Additional Bus Information */}
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
