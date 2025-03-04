"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useFcmToken from "@/utils/hooks/useFcmToken";
import {subscribeTokenToTopic} from "@/utils/wrapper/FCMWrapper";
import {getMessaging, onMessage} from "firebase/messaging";
import firebaseApp from "@/utils/firebase/firebase";

export default function Page() {
    const { id } = useParams(); // Get the `id` from the URL
    const [bus, setBus] = useState(null); // State to store the fetched bus data
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { fcmToken, notificationPermissionStatus } = useFcmToken();

    // Handle foreground messages
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Bus updated: ', payload);
                setBus((prevBus) => ({
                    ...prevBus,
                    currentLocation: payload.data.currentLocation,
                })); // Update the bus data
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);

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

    useEffect(() => {
        if (fcmToken) {
            console.log('FCM token bus:', fcmToken);
            // Subscribe to a topic
            subscribeTokenToTopic(fcmToken, `bus-${id}-tracking`);
        }
    }, [fcmToken]);

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
                        <path
                            d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                    </svg>
                </span>

                                    {/* Location Name */}
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                                        {location}
                                        {/* Current Location Chip */}
                                        {index === currentLocationIndex && (
                                            <span
                                                className="bg-green-500 text-white text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm ms-3">
                            Current Location
                        </span>
                                        )}
                                    </h3>
                                </li>
                            ))}
                        </ol>
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