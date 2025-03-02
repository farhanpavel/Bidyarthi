"use client";
import { UserPlus } from "lucide-react";
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
import { url } from "@/components/Url/page";

export default function Page() {
  const [data, setData] = useState({
    busNum: "",
    routeName: "",
    startPoint: "",
    endPoint: "",
    schedule: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Upload successful!");
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <UserPlus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle>বাস বিবরণ</CardTitle>
              <CardDescription>
                দয়া করে বাসের পদ নির্বাচন করুন এবং প্রয়োজনীয় তথ্য পূরণ করুন।
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
                      <h1 className="font-semibold text-sm">
                        বাসের তথ্য প্রদান করুন
                      </h1>
                    </div>
                    <div className="space-y-2 ">
                      <div className="space-y-2 ">
                        <Label className="text-xs" htmlFor="busNum">
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
                        <Label className="text-xs" htmlFor="routeName">
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
                        <Label className="text-xs" htmlFor="startPoint">
                          শুরুর স্থান
                        </Label>
                        <Input
                          id="startPoint"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="startPoint"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="endPoint">
                          শেষ স্থান
                        </Label>
                        <Input
                          id="endPoint"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="endPoint"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="schedule">
                          সময়সূচী
                        </Label>
                        <Input
                          id="schedule"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="schedule"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-7">
                  <Button
                    type="submit"
                    variant="default"
                    className="hover:transition-all hover:delay-100 font-bangla"
                  >
                    প্রদান করুন
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
