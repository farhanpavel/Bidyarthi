"use client";
import { UserPlus, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { url } from "@/components/Url/page";

export default function Page() {
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [mealData, setMealData] = useState({
    mealName: "",
    description: "",
    price: "",
    quantity: "",
    mealType: "", // New state for meal type
  });

  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setMealData({ ...mealData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      alert("অনুগ্রহ করে একটি ফাইল নির্বাচন করুন।");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mealName", mealData.mealName);
      formData.append("description", mealData.description);
      formData.append("price", parseFloat(mealData.price));
      formData.append("quantity", parseInt(mealData.quantity, 10));
      formData.append("mealType", mealData.mealType); // Append meal type

      const response = await fetch(`${url}/api/meal`, {
        method: "POST",
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViNTg3MzRiLTFiNDItNDQ5Mi05YWUyLTE0NzU2ZWEwNjg1OSIsImVtYWlsIjoiY2hlZjJAZ21haWwuY29tIiwiaWF0IjoxNzQxMDIwMjQzLCJleHAiOjE3NDE2MjUwNDN9._3yMo7EZ8Lx3yIZQcCf1NxSJ8wuKI8IwISdse0ruksI"
        },
        body: formData,
      });

      if (!response.ok) {
        alert("সার্ভার ত্রুটি! আবার চেষ্টা করুন।");
        throw new Error("ফাইল আপলোড ব্যর্থ হয়েছে");
      } else {
        alert("তথ্য সফলভাবে যোগ হয়েছে!");
        setLoading(false);
        router.back();
      }
    } catch (err) {
      console.error("আপলোড সমস্যা:", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <UserPlus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle>ক্যাফেটেরিয়া বিবরণ</CardTitle>
              <CardDescription>
                দয়া করে ক্যাফেটেরিয়ার পদ নির্বাচন করুন এবং প্রয়োজনীয় তথ্য
                পূরণ করুন।
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
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-6">
                    <h1 className="font-semibold text-sm">
                      ক্যাফেটেরিয়ার তথ্য প্রদান করুন
                    </h1>
                    <div className="flex flex-col w-1/4 space-y-3">
                      <Label htmlFor="mealType" className="text-xs">
                        মিলের ধরন নির্বাচন করুন
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setMealData((prev) => ({ ...prev, mealType: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="মিলের ধরন নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="Breakfast">প্রাতঃরাশ</SelectItem>
                          <SelectItem value="Lunch">দুপুরের খাবার</SelectItem>
                          <SelectItem value="Dinner">রাতের খাবার</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="mealName">
                        মিলের নাম
                      </Label>
                      <Input
                        id="mealName"
                        type="text"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="mealName"
                        value={mealData.mealName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="description">
                        মিলের বিবরণ
                      </Label>
                      <Input
                        id="description"
                        type="text"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="description"
                        value={mealData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="quantity">
                        পরিমাণ
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="quantity"
                        value={mealData.quantity}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs" htmlFor="price">
                        মূল্য (৳)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        className="w-1/2 border-[1px] border-gray-600"
                        name="price"
                        value={mealData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-7">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="hover:transition-all hover:delay-100"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "প্রদান করুন"
                    )}
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
