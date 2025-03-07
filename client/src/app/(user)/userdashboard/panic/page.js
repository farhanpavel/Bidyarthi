"use client";
import React from "react";
import { AlertCircle, MapPin, Shield } from "lucide-react";

export default function Page() {
    const handlePanicButtonClick = () => {
        // Add logic to send emergency alert and share live location
        alert("Emergency alert sent! Your live location is being shared with the university authority.");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-red-800 flex items-center justify-center gap-2">
                    <Shield className="h-10 w-10" />
                    Emergency Panic Button
                </h1>
                <p className="text-lg text-red-600 mt-2">
                    Are you feeling unsafe? We are here to help you.
                </p>
            </div>

            {/* Panic Button */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                    <h2 className="text-2xl font-semibold text-red-800">
                        Emergency Assistance
                    </h2>
                    <p className="text-gray-600">
                        If you are in immediate danger or feel unsafe, press the button below
                        to alert the university authority and share your live location.
                    </p>
                    <button
                        onClick={handlePanicButtonClick}
                        className="mt-6 px-8 py-4 bg-red-600 text-white rounded-full text-xl font-semibold hover:bg-red-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                        Press for Help
                    </button>
                </div>
            </div>

            {/* Live Location Sharing */}
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="flex flex-col items-center gap-4">
                    <MapPin className="h-12 w-12 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-blue-800">
                        Share Live Location
                    </h2>
                    <p className="text-gray-600">
                        Your live location will be shared with the university authority to
                        ensure your safety.
                    </p>
                    <button
                        onClick={() => alert("Live location shared!")}
                        className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-full text-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                        Share Location
                    </button>
                </div>
            </div>

            {/* Footer Note */}
            <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
                Your safety is our priority. By using this service, you agree to share
                your live location with the university authority for emergency response.
            </p>
        </div>
    );
}