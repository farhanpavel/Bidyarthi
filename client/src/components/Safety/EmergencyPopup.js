"use client";
import React, { useState } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EmergencyPopup = ({
  message,
  overlayText,
  instructions,
  onClose,
  emergencyLevel,
  latitude,
  longitude,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Function to determine chip styles based on emergency level
  const getChipStyles = (level) => {
    switch (level) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const center = [lat, lng];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto text-center">
        {/* Emergency Level Chip */}
        <div
          className={`fixed top-4 right-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getChipStyles(
            emergencyLevel
          )} z-50`}
        >
          {emergencyLevel}
        </div>

        <h2 className="text-3xl font-bold text-red-600 mb-6">
          Emergency Alert!
        </h2>
        <p className="text-gray-700 text-lg mb-6">{message}</p>

        <div className="relative mb-6 h-[500px] w-full rounded-lg overflow-hidden border border-gray-300">
          <Map
            center={center}
            zoom={15}
            height={500}
            width="100%"
            // Disable map movement
            onBoundsChanged={() => {}}
            onClick={() => {}}
            provider={(x, y, z) => {
              return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
            }}
          >
            <Marker
              anchor={center}
              color="#8B5CF6" // Purple color
              width={50} // Larger marker
              height={60}
              onClick={() => setDialogOpen(true)}
            />
          </Map>
        </div>

        <div className="text-left flex items-center space-x-4">
          <h3 className="text-2xl font-semibold">Instructions:</h3>
          <p className="text-gray-700 text-lg">{instructions}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-8 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors text-lg"
        >
          Acknowledge
        </button>

        {/* Dialog for overlay text */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Emergency Details</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-lg font-medium">{overlayText}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmergencyPopup;
