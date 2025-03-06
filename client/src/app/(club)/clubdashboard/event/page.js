"use client";
import { Button } from "@/components/ui/button";
import { Calendar1Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar"; // Import react-calendar
import "react-calendar/dist/Calendar.css"; // Default styles
import "../event/custom-calendar.css"; // Custom styles for event highlights
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";
export default function Page() {
  const router = useRouter();
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  var token = Cookies.get("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/club/event/data`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setClubData(data[0]); // Assuming the API returns an array with one club object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clubData) return <div>No data found</div>;

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

  // Function to handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventsForSelectedDate(getEventsForDate(date));
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
        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/clubdashboard/event/new")}
            variant="default"
          >
            Create
          </Button>
        </div>
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
              onChange={handleDateClick}
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

          {/* Display events for the selected date */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-2">
              {selectedDate ? selectedDate.toDateString() : "Select a date"}
            </h2>
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map((event) => (
                <div
                  key={event.id}
                  className="bg-white shadow-xl p-4 rounded-md mb-2"
                >
                  <h1 className="font-bold text-sm">{event.name}</h1>
                  <p className="text-xs text-[#6A6A6A]">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">No events on this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
