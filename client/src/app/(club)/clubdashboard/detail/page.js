"use client";
import { UserPlus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table2";
import { Badge } from "@/components/ui/badge";
import { url } from "@/components/Url/page";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { subscribeTokenToTopic } from "@/utils/wrapper/FCMWrapper";
import { toast } from "react-toastify";
import { MessageContext } from "@/utils/context/MessageContext";

export default function Page() {
  const [userData, setUserData] = useState(null);
  const [rsvps, setRsvps] = useState([]); // New state for real-time RSVP updates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const [clubId, setClubId] = useState("");
  const { message } = useContext(MessageContext);

  // Subscribe to FCM topic when fcmToken and clubId are available
  useEffect(() => {
    if (fcmToken && clubId) {
      console.log("FCM token club:", fcmToken);
      subscribeTokenToTopic(fcmToken, `club-${clubId}`);
    }
  }, [fcmToken, clubId]);

  // Fetch initial user data and RSVPs
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${url}/api/assign/event/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3YzkwOGJjLTYzMzQtNDFhYi1iOGZiLWFmYzU5NDE4MjI5ZiIsImVtYWlsIjoiaG9sYUBnbWFpbC5jb20iLCJpYXQiOjE3NDExOTI4MTIsImV4cCI6MTc0MTc5NzYxMn0.6HPlvRoIfxzAHFd6lNKbg6oNNK4g5-x4eMUJ5gn0__g",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setClubId(data.id); // Set clubId from fetched data
        setUserData(data);
        // Initialize RSVPs from fetched data
        const initialRsvps = data.clubMemberships.flatMap((membership) =>
          membership.club.events.flatMap((event) =>
            event.rsvps.map((rsvp) => ({
              userName: rsvp.user.name,
              eventName: event.name,
              eventLocation: event.location,
              eventStatus: rsvp.status,
              eventId: event.id,
            }))
          )
        );
        setRsvps(initialRsvps);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle real-time RSVP updates via FCM
  useEffect(() => {
    if (message) {
      console.log("Message received: ", message);

      if (message.data?.topic === `club-${clubId}`) {
        const { topic, ...rest } = message.data;

        // Create a new RSVP object from the message data
        const newRsvp = {
          userName: rest.userName || "Unknown User", // Fallback if userName isn't sent
          eventName: rest.name, // From notificationData.name
          eventLocation: rest.location, // From notificationData.location
          eventStatus: rest.status, // From notificationData.status
          eventId: rest.eventId || Date.now().toString(), // Fallback ID if not provided
        };

        // Update the RSVPs state with the new RSVP
        setRsvps((prevRsvps) => {
          // Check if this RSVP already exists (optional deduplication)
          const rsvpExists = prevRsvps.some(
            (rsvp) =>
              rsvp.eventId === newRsvp.eventId &&
              rsvp.userName === newRsvp.userName
          );
          if (!rsvpExists) {
            return [...prevRsvps, newRsvp];
          }
          return prevRsvps; // If it exists, don't add duplicate
        });

        // Show a toast notification
        toast.success(
          <div>
            <strong>New RSVP Update:</strong>
            <p>{`Event: ${rest.name}, Status: ${rest.status}`}</p>
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
  }, [message, clubId]); // Changed chefId to clubId

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No data found</div>;

  // Use rsvps state for rendering instead of flattenedData
  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <UserPlus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>

        {/* Updated Table to use rsvps state */}
        <div>
          <Table>
            <TableCaption>A list of event RSVPs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Event Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.eventName}</TableCell>
                  <TableCell>{item.eventLocation}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.eventStatus === "going"
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white"
                      }
                    >
                      {item.eventStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total RSVPs</TableCell>
                <TableCell className="text-right">{rsvps.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
