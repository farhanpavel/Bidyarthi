"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { url } from "@/components/Url/page";
import { TrafficCone } from "lucide-react";

export default function Page() {
  const { id } = useParams(); 
  const [bus, setBus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${url}/api/bus/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bus data");
        }
        const data = await response.json();
        setBus(data); 
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching bus data:", error);
      }
    };

    fetchBus();
  }, [id]);

 
  const updateCurrentLocation = async () => {
    if (!bus) return;

 
    const locations = bus.routeName
      .split(",")
      .map((location) => location.trim());
    const currentLocationIndex = locations.indexOf(bus.currentLocation);

  
    if (currentLocationIndex === locations.length - 1) {
      toast.info("The bus has reached its final destination.");
      return;
    }

  
    const nextLocation = locations[currentLocationIndex + 1];

    try {
      
      const response = await fetch(`${url}/api/bus/track/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentLocation: nextLocation }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bus location");
      }

  
      setBus((prevBus) => ({
        ...prevBus,
        currentLocation: nextLocation,
      }));

      toast.success(`Location updated to: ${nextLocation}`);
    } catch (error) {
      console.error("Error updating bus location:", error);
      toast.error("Failed to update bus location");
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  const locations = bus.routeName.split(",").map((location) => location.trim());

  const currentLocationIndex = locations.indexOf(bus.currentLocation);

  return (
    <div className="p-9 space-y-2">
      <div className="flex gap-x-2 items-center text-black">
        <TrafficCone className="text-3xl" />

        <h1 className="text-2xl font-bold">বাস রুট ট্র্যাকার</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
        বাস রুট পরিচালনা করুন এবং বর্তমান অবস্থান আপডেট করুন।
      </p>

   
      <Card className="bg-[#202020] border-none overflow-hidden">
        <CardHeader>
          <h1 className="text-2xl font-bold text-white">
            {bus.busNum}: {bus.startPoint} → {bus.endPoint}
          </h1>
          <p className="text-gray-300">রুট: {bus.routeName}</p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="text-white">
            <h2 className="text-xl font-semibold">বর্তমান অবস্থান</h2>
            <p className="text-gray-300">{bus.currentLocation}</p>
          </div>

     
          <div className="mt-6 bg-black p-8 rounded-lg">
            <ol className="relative border-s border-gray-600 mx-auto max-w-md">
              {locations.map((location, index) => (
                <li key={index} className="mb-10 ms-6">
            
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

               
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                    {location}
                    
                    {index === currentLocationIndex && (
                      <span className="bg-green-500 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm ms-3">
                        বর্তমান অবস্থান
                      </span>
                    )}
                  </h3>
                </li>
              ))}
            </ol>
          </div>

          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={updateCurrentLocation}
              className={`w-full max-w-md ${
                currentLocationIndex === locations.length - 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={currentLocationIndex === locations.length - 1}
            >
              {currentLocationIndex === locations.length - 1
                ? "যাত্রা শেষ হয়েছে"
                : "পরবর্তী স্টপে যান"}
            </Button>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">বাসের তথ্য</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">শুরু পয়েন্ট</span>
            <span>{bus.startPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">শেষ পয়েন্ট</span>
            <span>{bus.endPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">সময়সূচী</span>
            <span>{bus.schedule}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
