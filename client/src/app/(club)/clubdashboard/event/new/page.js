"use client";
import { Calendar1Icon, ListCollapse } from "lucide-react";
import { Loader2, UserPlus } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
export default function Page() {
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
  });
  var token = Cookies.get("token");
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    const isoDate = new Date(formData.date).toISOString();
    data.append("date", isoDate);
    data.append("location", formData.location);
    if (file) {
      data.append("file", file);
    }

    try {
      const response = await fetch(`${url}/api/club/event/data`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Event created successfully:", result);
        router.back(); // Redirect to events page
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <ListCollapse className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">বিবরণ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          আপনার ইভেন্টের ডাটা গুলো বিস্তারিতভাবে প্রদান করুন।
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle>ইভেন্ট তৈরি করুন</CardTitle>
              <CardDescription>
                ইভেন্ট তৈরি করুন: দয়া করে ইভেন্টের বিবরণ পূর্ণ করুন এবং একটি
                ছবি আপলোড করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-1/5 space-y-3">
                    <Label className="text-xs" htmlFor="file">
                      ছবি আপলোড করুন
                    </Label>
                    <Input
                      type="file"
                      name="file"
                      className="border-gray-600"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-y-6">
                    <div>
                      <h1 className="font-semibold text-sm">
                        ইভেন্টের তথ্য প্রদান করুন
                      </h1>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="name">
                          নাম
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="description">
                          বিবরণ
                        </Label>
                        <Input
                          id="description"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="date">
                          তারিখ
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="location">
                          অবস্থান
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="location"
                          value={formData.location}
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
                      disabled
                      className="hover:transition-all hover:delay-100"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="hover:transition-all hover:delay-100"
                    >
                      প্রদান করুন
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
