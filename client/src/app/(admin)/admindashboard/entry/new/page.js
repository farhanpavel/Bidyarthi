"use client";
import { BetweenHorizonalStart, Loader2, UserPlus } from "lucide-react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <UserPlus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">নতুন এন্ট্রি তৈরি করুন</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        এন্ট্রি ফর্ম পূরণ করে সাবমিট করুন
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle className="font-bangla">ব্যবহারকারী বিবরণ</CardTitle>
              <CardDescription className="font-bangla">
                ব্যবহারকারী বিবরণ: দয়া করে ব্যবহারকারীর পদ নির্বাচন করুন এবং
                প্রয়োজনীয় তথ্য পূর্ণ করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-1/4 space-y-3">
                    <Label htmlFor="role" className="text-xs font-bangla">
                      পদ নির্বাচন করুন
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, role: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="এখনও নির্ধারিত নয়" className="font-bangla" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Busdriver" className="font-bangla">বাস ড্রাইভার</SelectItem>
                        <SelectItem value="Clubpresident" className="font-bangla">
                          ক্লাব সভাপতি
                        </SelectItem>
                        <SelectItem value="Cafeteriachef" className="font-bangla">
                          ক্যান্টিন শেফ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-y-6">
                    <div>
                      <h1 className="font-semibold text-sm font-bangla">
                        ব্যবহারকারীর তথ্য প্রদান করুন
                      </h1>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bangla" htmlFor="name">
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
                        <Label className="text-xs font-bangla" htmlFor="email">
                          ইমেইল
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bangla" htmlFor="password">
                          পাসওয়ার্ড
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="password"
                          value={formData.password}
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
                      className="  hover:transition-all hover:delay-100 font-bangla"
                    >
                      প্রদান করুন
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled
                      className="  hover:transition-all hover:delay-100"
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
