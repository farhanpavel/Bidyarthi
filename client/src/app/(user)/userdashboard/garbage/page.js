"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trash, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null); // State for latitude
  const [longitude, setLongitude] = useState(null); // State for longitude
  const [isLoading, setIsLoading] = useState(false); // For file upload
  const [isSubmitting, setIsSubmitting] = useState(false); // For report submission
  const [isAiGenerated, setIsAiGenerated] = useState(false); // Track if AI has generated text

  // Function to get the user's current GPS location and convert it to an address
  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Set latitude and longitude
            setLatitude(latitude);
            setLongitude(longitude);

            // Fetch the address using OpenStreetMap Nominatim API
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const address = data.display_name || "Location not found";
              resolve(address);
            } catch (error) {
              reject(new Error("Unable to fetch address."));
            }
          },
          (error) => {
            reject(new Error("Unable to retrieve your location."));
          }
        );
      }
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(acceptedFiles);
    setIsLoading(true); // Set loading state for file upload

    try {
      // Get the user's current GPS location and convert it to an address
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Prepare the image for upload
      const formData = new FormData();
      formData.append("image", acceptedFiles[0]);

      // Send the image to the backend for analysis
      const response = await fetch(`${url}/api/waste/report`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const { type, weight, description } = data.analysisResult;
        setType(type);
        setWeight(weight);
        setDescription(description);
        setIsAiGenerated(true); // Enable editing after AI generates text
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false); // Reset loading state for file upload
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Function to handle the submission of the waste report
  const handleSubmitReport = async () => {
    if (files.length === 0) {
      alert("Please upload an image first.");
      return;
    }

    setIsSubmitting(true); // Set loading state for report submission

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("garbageType", type);
      formData.append("garbageWeight", weight);
      formData.append("latitude", latitude); // Add latitude
      formData.append("longitude", longitude); // Add longitude
      const token = Cookies.get("token");
      const response = await fetch(`${url}/api/waste/report/data`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        // Reset the form fields
        setFiles([]);
        setDescription("");
        setType("");
        setWeight("");
        setLocation("");
        setIsAiGenerated(false); // Disable editing after submission
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    } finally {
      setIsSubmitting(false); // Reset loading state for report submission
    }
  };

  return (
    <div className="p-9">
      <div className="flex gap-x-2 items-center text-black">
        <Trash className="text-3xl" />
        <h1 className="text-2xl font-bold font-bangla">আবর্জনা রিপোর্ট</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        আপনার আশেপাশের আবর্জনা সম্পর্কে রিপোর্ট করুন
      </p>

      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">অবস্থান</Label>
            <Input
              id="location"
              placeholder="আবর্জনার অবস্থান লিখুন"
              className="border-black/20"
              value={location}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">বিবরণ</Label>
            <Textarea
              id="description"
              placeholder="আবর্জনার বিস্তারিত বিবরণ লিখুন"
              className="min-h-[120px] border-black/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              readOnly={!isAiGenerated} // Enable editing only if AI has generated text
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">আবর্জনার ধরন</Label>
              <Input
                id="type"
                placeholder="AI দ্বারা নির্ধারিত হবে"
                value={type}
                onChange={(e) => setType(e.target.value)}
                readOnly={!isAiGenerated} // Enable editing only if AI has generated text
                className="bg-muted/30 border-black/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">আনুমানিক ওজন</Label>
              <Input
                id="weight"
                placeholder="AI দ্বারা নির্ধারিত হবে"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                readOnly={!isAiGenerated} // Enable editing only if AI has generated text
                className="bg-muted/30 border-black/20"
              />
            </div>
          </div>

          {/* Drag and Drop File Upload */}
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-black/20 p-6 text-center cursor-pointer bg-gray-100 rounded-lg"
          >
            <input {...getInputProps()} />
            {isLoading ? ( // Show loader for file upload
              <Loader2 className="mx-auto text-3xl text-gray-500 animate-spin" />
            ) : (
              <>
                <Upload className="mx-auto text-3xl text-gray-500" />
                <p className="text-sm text-gray-500">
                  ফাইল টেনে এনে এখানে ছাড়ুন অথবা ক্লিক করুন
                </p>
              </>
            )}
          </div>

          {/* Display Selected Files */}
          {files.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border border-black/20 rounded-md">
              <h2 className="text-sm font-bold">আপলোডকৃত ফাইল:</h2>
              <ul className="text-sm text-gray-600">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <Button
              className="w-full bg-black hover:bg-black/90 text-white"
              onClick={handleSubmitReport}
              disabled={isLoading || isSubmitting} // Disable button during file upload or report submission
            >
              {isSubmitting ? ( // Show loader for report submission
                <Loader2 className="animate-spin" />
              ) : (
                "রিপোর্ট জমা দিন"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
