"use client";
import { FireExtinguisher, Loader2 } from "lucide-react";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState({
    message: "",
    location: "",
    type: "",
    emergencyLevel: "MEDIUM", // Default value for emergency level
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value, field) => {
    setData({ ...data, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);

    try {
      const response = await fetch(`${url}/api/safety-alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Server Error");
        throw new Error("Failed to submit safety alert");
      } else {
        setLoading(true);
        router.back();
      }
    } catch (err) {
      console.error("Submission error", err);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <FireExtinguisher />
          <h1 className="text-2xl font-bold font-bangla">Safety Alert Form</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          Submit a safety alert to notify the university community.
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle>Safety Alert Details</CardTitle>
              <CardDescription>
                Please provide the necessary details for the safety alert.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-6">
                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="message">
                        Message
                      </Label>
                      <Input
                        id="message"
                        type="text"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="message"
                        value={data.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Location Field */}
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="location">
                        Location (Optional)
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Type Field */}
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="type">
                        Type
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange(value, "type")
                        }
                        value={data.type}
                        required
                      >
                        <SelectTrigger className="w-1/2 border-[1px] border-gray-600">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ANNOUNCEMENT">
                            Announcement
                          </SelectItem>
                          <SelectItem value="EMERGENCY">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Emergency Level Field (Conditional) */}
                    {data.type === "EMERGENCY" && (
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="emergencyLevel">
                          Emergency Level
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(value, "emergencyLevel")
                          }
                          value={data.emergencyLevel}
                          required
                        >
                          <SelectTrigger className="w-1/2 border-[1px] border-gray-600">
                            <SelectValue placeholder="Select emergency level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-7">
                  {isLoading ? (
                    <Button
                      type="submit"
                      className="hover:transition-all hover:delay-100"
                    >
                      Submit
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
