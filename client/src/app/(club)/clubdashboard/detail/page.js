"use client";
import { TextSearch, UserPlus } from "lucide-react";
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
import Cookies from "js-cookie";
export default function Page() {
  const [userData, setUserData] = useState(null);
  const [rsvps, setRsvps] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const [clubId, setClubId] = useState("");
  const { message } = useContext(MessageContext);
  let token = Cookies.get("token");

  useEffect(() => {
    if (fcmToken && clubId) {
      console.log("FCM token club:", fcmToken);
      subscribeTokenToTopic(fcmToken, `club-${clubId}`);
    }
  }, [fcmToken, clubId]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${url}/api/assign/event/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setClubId(data.id); 
        setUserData(data);
  
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


  useEffect(() => {
    if (message) {
      console.log("Message received: ", message);

      if (message.data?.topic === `club-${clubId}`) {
        const { topic, ...rest } = message.data;

  
        const newRsvp = {
          userName: rest.userName || "Unknown User", 
          eventName: rest.name, 
          eventLocation: rest.location, 
          eventStatus: rest.status, 
          eventId: rest.eventId || Date.now().toString(), 
        };

        setRsvps((prevRsvps) => {
         
          const rsvpExists = prevRsvps.some(
            (rsvp) =>
              rsvp.eventId === newRsvp.eventId &&
              rsvp.userName === newRsvp.userName
          );
          if (!rsvpExists) {
            return [...prevRsvps, newRsvp];
          }
          return prevRsvps; 
        });


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
  }, [message, clubId]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No data found</div>;

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <TextSearch className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">ডাটা সমূহ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          আপনার ইভেন্টসমূহের প্রতিক্রিয়া দেখুন
        </p>

 
        <div>
          <Table>
            <TableCaption>ইভেন্টের RSVP তালিকা.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ব্যবহারকারীর নাম</TableHead>
                <TableHead>ইভেন্টের নাম</TableHead>
                <TableHead>ইভেন্টের স্থান</TableHead>
                <TableHead>স্থিতি</TableHead>
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
                <TableCell colSpan={3}>মোট RSVP</TableCell>
                <TableCell className="text-right">{rsvps.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
