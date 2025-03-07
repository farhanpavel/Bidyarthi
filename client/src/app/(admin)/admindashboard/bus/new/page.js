"use client";
import { UserPlus, Loader2, ArrowUpDown, Bus } from "lucide-react";
import React, { useState, useEffect } from "react";
import "dotenv/config";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import { GrSwitch } from "react-icons/gr";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState({
    busNum: "",
    routeName: "",
    startPoint: "Campus",
    endPoint: "",
    schedule: "",
  });
  const [file, setFile] = useState(null);
  const [places, setPlaces] = useState([]);

  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=commercial,education,public_transport&filter=circle:90.4125,23.8103,10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await response.json();

        if (data.features) {
          // Filter unique place names using Set
          const uniquePlaces = [
            ...new Set(
              data.features
                .map((place) => place.properties.suburb)
                .filter((name) => name) // Remove undefined/null values
            ),
          ].map((name) => ({ name })); // Convert to array of objects

          // Add "Campus" to the list
          uniquePlaces.push({ name: "Campus" });

          setPlaces(uniquePlaces);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    }

    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);

    if (data.startPoint !== "Campus" && data.endPoint !== "Campus") {
      alert("Either startPoint or endPoint must be set to 'Campus'.");
      setLoading(true);
      return;
    }

    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("busNum", data.busNum);
      formData.append("routeName", data.routeName);
      formData.append("startPoint", data.startPoint);
      formData.append("endPoint", data.endPoint);
      formData.append("schedule", data.schedule);

      const response = await fetch(`${url}/api/bus`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Server Error");
        throw new Error("Failed to upload file");
      } else {
        if (response.ok) {
          setLoading(true);
          router.back();
        }
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  const switchPoints = () => {
    setData((prev) => ({
      ...prev,
      startPoint: prev.endPoint,
      endPoint: prev.startPoint,
    }));
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Bus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">বাস এন্ট্রি ফর্ম</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          বাস রুট, সময়সূচী এবং অন্যান্য তথ্য যোগ করে নতুন বাস সেবা শুরু করুন।
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle className="font-bangla">বাস বিবরণ</CardTitle>
              <CardDescription className="font-bangla">
                দয়া করে বাসের প্রয়োজনীয় তথ্য পূরণ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-1/5 space-y-3">
                    <Input
                      type="file"
                      name="file"
                      className="border-gray-600"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="flex flex-col space-y-6">
                    <div>
                      <h1 className="font-semibold text-sm font-bangla">
                        বাসের তথ্য প্রদান করুন
                      </h1>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-bangla" htmlFor="busNum">
                          বাস নম্বর
                        </Label>
                        <Input
                          id="busNum"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="busNum"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          className="text-xs font-bangla"
                          htmlFor="routeName"
                        >
                          রুট নাম
                        </Label>
                        <Input
                          id="routeName"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="routeName"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          className="text-xs font-bangla"
                          htmlFor="startPoint"
                        >
                          শুরুর স্থান
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("startPoint", value)
                          }
                          value={data.startPoint}
                          required
                        >
                          <SelectTrigger className="w-1/2 border-[1px] border-gray-600">
                            <SelectValue
                              className="font-bangla"
                              placeholder="স্থান নির্বাচন করুন"
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {places.map((place, index) => (
                              <SelectItem key={index} value={place.name}>
                                {place.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-y-2">
                        <Button
                          type="button"
                          onClick={switchPoints}
                          className="flex items-center gap-x-2"
                        >
                          <ArrowUpDown size={24} />
                          <span className="font-bangla">
                            শুরু এবং শেষ স্থান পরিবর্তন করুন
                          </span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className="text-xs font-bangla"
                          htmlFor="endPoint"
                        >
                          শেষ স্থান
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("endPoint", value)
                          }
                          value={data.endPoint}
                          required
                        >
                          <SelectTrigger className="w-1/2 border-[1px] border-gray-600">
                            <SelectValue
                              className="font-bangla"
                              placeholder="স্থান নির্বাচন করুন"
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {places.map((place, index) => (
                              <SelectItem key={index} value={place.name}>
                                {place.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          className="text-xs font-bangla"
                          htmlFor="schedule"
                        >
                          সময়সূচী
                        </Label>
                        <Input
                          id="schedule"
                          type="time"
                          className="w-1/5 border-[1px] border-gray-600"
                          name="schedule"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-7">
                  {isLoading ? (
                    <Button
                      type="submit"
                      className="hover:transition-all hover:delay-100 font-bangla"
                    >
                      প্রদান করুন
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled
                      className="hover:transition-all hover:delay-100"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                  )}
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
