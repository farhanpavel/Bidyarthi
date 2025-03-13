"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { url } from "@/components/Url/page";
import { MapIcon } from "lucide-react";

export default function Page() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState([23.8069, 90.3687]); // Default to Mirpur, Dhaka
  const [placeName, setPlaceName] = useState("Loading location..."); // State for place name
  const router = useRouter();

  // Function to fetch place name using latitude and longitude
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
        if (!response.ok) {
          throw new Error("Failed to fetch bus data");
        }
        const data = await response.json();
        setBus(data);
        if (data.currentLatitude && data.currentLongitude) {
          setPosition([data.currentLatitude, data.currentLongitude]);
          // Fetch place name for the initial location
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

  // Function to update bus location
  const updateLocation = async () => {
    // Generate slight random changes in latitude and longitude
    const randomOffset = () => (Math.random() - 0.5) * 0.002; // Small change in coordinates
    const newLatitude = position[0] + randomOffset();
    const newLongitude = position[1] + randomOffset();
    const newPosition = [newLatitude, newLongitude];

    try {
      const response = await fetch(`${url}/api/bus/track/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentLatitude: newLatitude,
          currentLongitude: newLongitude,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bus location");
      }

      const updatedBus = await response.json();

      setPosition(newPosition); // Move marker
      setBus((prevBus) => ({
        ...prevBus,
        currentLatitude: newLatitude,
        currentLongitude: newLongitude,
      }));

      // Fetch and update place name for the new location
      const name = await fetchPlaceName(newLatitude, newLongitude);
      setPlaceName(name);

      toast.success("Location updated successfully");
    } catch (error) {
      console.error("Error updating bus location:", error);
      toast.error("Failed to update bus location");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-9 space-y-2">
      <div className="flex gap-x-2 items-center text-black">
        <MapIcon className="text-3xl" />
        <h1 className="text-2xl font-bold font-bangla">সময়সূচী</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        আপনার বাসসমূহ কার্যকরভাবে পরিচালনা করুন।
      </p>
      <Card className="text-black border-2 overflow-hidden">
        <CardHeader>
          <h1 className="text-2xl font-bold ">
            {bus.busNum}: {bus.startPoint} → {bus.endPoint}
          </h1>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="">
            <h2 className="text-xl font-semibold">Current Location</h2>
            <p className="">{placeName}</p> {/* Display place name */}
          </div>

          <div className="mt-6  p-8 rounded-lg">
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
              onClick={updateLocation}
              className="w-full max-w-md bg-green-500 hover:bg-green-600"
            >
              Update Location
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
