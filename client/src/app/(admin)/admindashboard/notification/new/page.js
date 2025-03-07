"use client";
import { Bell, FireExtinguisher, Loader2 } from "lucide-react";
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
import {url} from "@/components/Url/page";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState({
    message: "",
    location: "",
    type: "",
    emergencyLevel: "MEDIUM", 
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
      const response = await fetch(`${url}/api/emergency/publish`, {
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
          <Bell />
          <h1 className="text-2xl font-bold font-bangla">নিরাপত্তা সতর্কতা ফর্ম</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        বিশ্ববিদ্যালয় সম্প্রদায়কে জানাতে একটি নিরাপত্তা সতর্কতা জমা দিন।
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle className="font-bangla">নিরাপত্তা সতর্কতার বিবরণ</CardTitle>
              <CardDescription className="font-bangla">
              অনুগ্রহ করে নিরাপত্তা সতর্কতার জন্য প্রয়োজনীয় বিবরণ প্রদান করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-6">
                   
                    <div className="space-y-2">
                      <Label className="text-xs font-bangla" htmlFor="message">
                      নির্দেশনা/বার্তা
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

                    
                    <div className="space-y-2">
                      <Label className="text-xs font-bangla" htmlFor="location">
                      স্থান (ঐচ্ছিক)
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

                    
                    <div className="space-y-2">
                      <Label className="text-xs font-bangla" htmlFor="type">
                      ধরন
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
                          <SelectItem value="ANNOUNCEMENT" className="font-bangla">
                          ঘোষণা
                          </SelectItem>
                          <SelectItem value="EMERGENCY" className="font-bangla">জরুরি</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    
                    {data.type === "EMERGENCY" && (
                      <div className="space-y-2">
                        <Label className="text-xs font-bangla" htmlFor="emergencyLevel">
                        জরুরি স্তর
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
                            <SelectItem value="LOW" className="font-bangla">নিম্ন</SelectItem>
                            <SelectItem value="MEDIUM" className="font-bangla">মধ্যম</SelectItem>
                            <SelectItem value="HIGH" className="font-bangla">উচ্চ</SelectItem>
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
                      className="hover:transition-all hover:delay-100 font-bangla"
                    >
                      জমা দিন
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
