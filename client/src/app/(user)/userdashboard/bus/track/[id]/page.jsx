"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const { id } = useParams(); // Get the `id` from the URL
    const [bus, setBus] = useState(null); // State to store the fetched bus data
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/bus/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bus data");
                }
                const data = await response.json();
                console.log(data);
                setBus(data); // Set the fetched bus data
                console.log(bus);
                setLoading(false); // Set loading state to false

            } catch (error) {
                console.error("Error fetching bus data:", error);
            }
        };

        fetchBus();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

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
                    <h1 className="text-2xl font-bold text-white">{bus.busNum}: {bus.startPoint} → {bus.endPoint}</h1>
                    <p className="text-gray-300">Route: {bus.routeName}</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <div className="text-white">
                        <h2 className="text-xl font-semibold">Current Location</h2>
                        <p className="text-gray-300">{bus.currentLocation}</p>
                    </div>

                    {/* Dot-Connect UI for Bus Route */}
                    <div className="mt-6">
                        <div className="flex flex-col items-center space-y-4">
                            {locations.map((location, index) => (
                                <div key={index} className="flex items-center">
                                    {/* Dot */}
                                    <div
                                        className={`w-4 h-4 rounded-full ${
                                            index === currentLocationIndex
                                                ? "bg-green-500"
                                                : "bg-gray-500"
                                        }`}
                                    ></div>
                                    {/* Location Name */}
                                    <span
                                        className={`ml-2 ${
                                            index === currentLocationIndex
                                                ? "text-green-500 font-bold"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {location}
                                    </span>
                                    {/* Connector Line */}
                                    {index < locations.length - 1 && (
                                        <div className="w-1 h-8 bg-gray-500 ml-1.5"></div>
                                    )}
                                </div>
                            ))}
                        </div>
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