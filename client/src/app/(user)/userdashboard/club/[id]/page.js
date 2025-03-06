"use client";
import { Button } from "@/components/ui/button";
import { Calendar1Icon, ThumbsUp, CalendarCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Calendar from "react-calendar"; // Import react-calendar
import "react-calendar/dist/Calendar.css"; // Default styles
import "./custom-calendar.css"; // Custom styles for event highlights
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
export default function ClubEventPage() {
  const { id } = useParams(); // Get the dynamic id from URL
  const router = useRouter();
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disabledEvents, setDisabledEvents] = useState(new Set()); // Track disabled events
  var token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/club/event/data/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Ensure data is an array and get the first item
        if (Array.isArray(data) && data.length > 0) {
          setClubData(data[0]); // Extract first club entry
        } else {
          setClubData(null);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Function to check if an event is disabled (flag is true)
  const checkEventFlag = async (eventId) => {
    try {
      const response = await fetch(`${url}/api/assign/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch flag status");
      }

      const data = await response.json();
      return data?.flag === true; // Return true if flag is true
    } catch (error) {
      console.error("Error fetching flag:", error);
      return false;
    }
  };

  // Check flag status for all events on component mount
  useEffect(() => {
    const fetchFlags = async () => {
      if (clubData?.club?.events) {
        const disabled = new Set();
        for (const event of clubData.club.events) {
          const isDisabled = await checkEventFlag(event.id);
          if (isDisabled) {
            disabled.add(event.id);
          }
        }
        setDisabledEvents(disabled);
      }
    };

    fetchFlags();
  }, [clubData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clubData) return <div>No data found</div>;

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short", day: "numeric" });
  };

  // Convert event dates into a Set for quick lookup
  const eventDates = new Set(
    clubData.club.events.map((event) => new Date(event.date).toDateString())
  );

  // Function to check if a date has an event
  const isEventDate = (date) => eventDates.has(date.toDateString());

  // Function to get events for a specific date
  const getEventsForDate = (date) =>
    clubData.club.events.filter(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

  // Function to handle button click (Interested / Going)
  const handleButtonClick = async (eventId, status) => {
    console.log(eventId);
    try {
      const response = await fetch(`${url}/api/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          status,
          eventId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign event");
      } else {
        alert("Successfully assigned!");
      }

      // Disable the button after it has been clicked
      setDisabledEvents((prev) => new Set(prev.add(eventId)));
    } catch (error) {
      console.error("Error assigning event:", error);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Calendar1Icon className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>

        <div className="relative w-full h-[300px]">
          <img
            src={clubData.club.club_url}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">
              {clubData.club.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Calendar with highlighted events */}
          <div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={({ date, view }) =>
                view === "month" && isEventDate(date) ? (
                  <div
                    className="event-dot"
                    title={getEventsForDate(date)
                      .map((e) => e.name)
                      .join(", ")}
                  ></div>
                ) : null
              }
              className="custom-calendar"
            />
          </div>

          {/* Render Events Dynamically */}
          {clubData.club.events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-xl rounded-lg flex flex-col h-full"
            >
              {/* Event Image */}
              <img
                src={event.url}
                alt={event.name}
                className="rounded-t-xl w-full h-48 object-cover"
              />

              {/* Event Details */}
              <div className="flex gap-x-3 p-3 flex-grow">
                <div>
                  <p className="text-[#3D37F1] text-center text-[0.6rem] font-bold">
                    {formatDate(event.date).split(" ")[0]} {/* Month */}
                  </p>
                  <h1 className="font-bold text-lg text-center">
                    {formatDate(event.date).split(" ")[1]} {/* Day */}
                  </h1>
                </div>
                <div className="space-y-2">
                  <h1 className="font-bold text-sm">{event.name}</h1>
                  <p className="text-xs text-[#6A6A6A]">{event.description}</p>
                </div>
              </div>

              {/* Buttons - Always at Bottom */}
              <div className="mt-auto flex justify-between p-3">
                <Button
                  className="bg-gradient-to-r py-2 px-4 text-xs from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 flex items-center"
                  onClick={() => handleButtonClick(event.id, "interested")}
                  disabled={disabledEvents.has(event.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" /> Interested
                </Button>

                <Button
                  className="bg-gradient-to-r text-xs from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 flex items-center"
                  onClick={() => handleButtonClick(event.id, "going")}
                  disabled={disabledEvents.has(event.id)}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" /> Going
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
