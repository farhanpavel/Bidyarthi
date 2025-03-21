"use client"; // Required for using React hooks in Next.js
import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { url } from "@/components/Url/page";

export default function Page() {
  const [wasteData, setWasteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/waste`);
        const data = await response.json();
        setWasteData(data);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to calculate garbage density for each coordinate
  const calculateDensity = () => {
    const coordinateCounts = {};

    wasteData.forEach((waste) => {
      const { latitude, longitude } = waste;
      const coordinateKey = `${latitude},${longitude}`;

      if (coordinateCounts[coordinateKey]) {
        coordinateCounts[coordinateKey]++;
      } else {
        coordinateCounts[coordinateKey] = 1;
      }
    });

    return coordinateCounts;
  };

  // Function to get marker color based on garbage density
  const getMarkerColor = (count) => {
    if (count >= 2) {
      return "red"; // High density
    } else if (count >= 1) {
      return "yellow"; // Low density
    } else {
      return "green"; // No garbage
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
      <h1 className="text-2xl font-bold text-center my-6">
        Garbage Density Map
      </h1>
      <div className="w-full h-[600px]">
        <Map
          defaultCenter={[23.8103, 90.4125]} // Default center for Dhaka
          defaultZoom={12}
          height={600}
        >
          {Object.entries(calculateDensity()).map(([coordinateKey, count]) => {
            const [latitude, longitude] = coordinateKey.split(",").map(Number);
            const color = getMarkerColor(count);

            return (
              <Marker
                key={coordinateKey}
                anchor={[latitude, longitude]}
                color={color}
                onClick={() =>
                  alert(
                    `Location: ${latitude}, ${longitude}\nGarbage Count: ${count}\nStatus: ${
                      color === "red" ? "High Density" : "Low Density"
                    }`
                  )
                }
              />
            );
          })}
        </Map>
      </div>
    </div>
  );
}
