"use client";
import { Button } from "@/components/ui/button";
import { HandPlatter, Map, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState([]); // State to store fetched meals

  // Fetch meals from the API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/bus");
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  // Function to calculate time difference in minutes
  const getTimeDifferenceInMinutes = (departureTime) => {
    // Get current time in 24-hour format
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Parse departure time (e.g., "3:15")
    const [departureHours, departureMinutes] = departureTime.split(":").map(Number);

    // Calculate total minutes for current time and departure time
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const departureTotalMinutes = departureHours * 60 + departureMinutes;

    // Calculate the difference
    return departureTotalMinutes - currentTotalMinutes;
  };

  // Filter buses departing in the next 30 minutes
  const busesDepartingSoon = meals.filter((meal) => {
    const timeDifference = getTimeDifferenceInMinutes(meal.schedule);
    return timeDifference > 0 && timeDifference <= 30; // Departure within 30 minutes
  });

  // Filter buses departing later than 30 minutes
  const moreBuses = meals.filter((meal) => {
    const timeDifference = getTimeDifferenceInMinutes(meal.schedule);
    return timeDifference > 30; // Departure after 30 minutes
  });

  // Filter buses that have already left
  const busesDeparted = meals.filter((meal) => {
    const timeDifference = getTimeDifferenceInMinutes(meal.schedule);
    return timeDifference < 0; // Departure time is earlier than current time
  });

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <HandPlatter className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">BUS schedule</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          bus go broom broom
        </p>
        <div>
          {/* Departure in 30 Minutes Section */}
          <div className="mt-4">
            <div className="flex justify-center">
              <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
                Departure in 30 minutes
              </h1>
            </div>
            <div className="flex flex-col">
              {busesDepartingSoon.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white shadow-xl py-3 px-5 rounded-lg flex flex-row gap-6"
                >
                  {/* Image on the left */}
                  <div className="flex-shrink-0">
                    <img
                      src={"https://i.ibb.co.com/ZpbRV8sY/Screenshot-2025-03-04-at-02-33-40.png"}
                      alt={meal.busNum}
                      width={80}
                      height={800}
                      className="rounded-lg object-cover w-[80px] h-[80px]"
                    />
                  </div>

                  {/* Content on the right */}
                  <div className="flex flex-row justify-between items-center w-full">
                    {/* Bus Route */}
                    <div className="space-y-1">
                      <p className="text-xl font-semibold">{meal.startPoint} → {meal.endPoint}</p>
                      <p className="text-sm text-gray-600">
                        {meal.routeName}
                      </p>
                    </div>

                    {/* Bus Number */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Bus Number</p>
                      <p className="text-lg font-bold">{meal.busNum}</p>
                    </div>

                    {/* Departure Time */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Departure Time</p>
                      <p className="text-lg font-bold">{meal.schedule}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Buses Section */}
          <div className="flex justify-center mt-6">
            <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
              More Buses
            </h1>
          </div>
          <div className="flex flex-col">
            {moreBuses.map((meal) => (
              <div
                key={meal.id}
                className="bg-white shadow-xl py-3 px-5 rounded-lg flex flex-row gap-6"
              >
                {/* Image on the left */}
                <div className="flex-shrink-0">
                  <img
                    src={"https://i.ibb.co.com/ZpbRV8sY/Screenshot-2025-03-04-at-02-33-40.png"}
                    alt={meal.busNum}
                    width={80}
                    height={800}
                    className="rounded-lg object-cover w-[80px] h-[80px]"
                  />
                </div>

                {/* Content on the right */}
                <div className="flex flex-row justify-between items-center w-full">
                  {/* Bus Route */}
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">{meal.startPoint} → {meal.endPoint}</p>
                    <p className="text-sm text-gray-600">
                      {meal.routeName}
                    </p>
                  </div>

                  {/* Bus Number */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Bus Number</p>
                    <p className="text-lg font-bold">{meal.busNum}</p>
                  </div>

                  {/* Departure Time */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Departure Time</p>
                    <p className="text-lg font-bold">{meal.schedule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Departed Buses Section */}
          <div className="flex justify-center mt-6">
            <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
              Departed Buses
            </h1>
          </div>
          <div className="flex flex-col">
            {busesDeparted.map((meal) => (
              <div
                key={meal.id}
                className="bg-white shadow-xl py-3 px-5 rounded-lg flex flex-row gap-6 grayscale opacity-50 relative"
              >
                {/* Departed Label */}
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Departed
                </div>

                {/* Image on the left */}
                <div className="flex-shrink-0">
                  <img
                    src={"https://i.ibb.co.com/ZpbRV8sY/Screenshot-2025-03-04-at-02-33-40.png"}
                    alt={meal.busNum}
                    width={80}
                    height={800}
                    className="rounded-lg object-cover w-[80px] h-[80px]"
                  />
                </div>

                {/* Content on the right */}
                <div className="flex flex-row justify-between items-center w-full">
                  {/* Bus Route */}
                  <div className="space-y-1">
                    <p className="text-xl font-semibold">{meal.startPoint} → {meal.endPoint}</p>
                    <p className="text-sm text-gray-600">
                      {meal.routeName}
                    </p>
                  </div>

                  {/* Bus Number */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Bus Number</p>
                    <p className="text-lg font-bold">{meal.busNum}</p>
                  </div>

                  {/* Departure Time */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Departure Time</p>
                    <p className="text-lg font-bold">{meal.schedule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}