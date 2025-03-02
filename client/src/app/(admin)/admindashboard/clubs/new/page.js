"use client";
import { UserPlus, Loader2 } from "lucide-react";
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
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    address: "",
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
    setLoading(false);
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", data.name);
      formData.append("description", data.address);
      console.log(formData);

      const response = await fetch(`${url}/api/club`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Server Error");
        throw new Error("Failed to upload file");
      } else {
        setLoading(true);

        router.back();
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
                    />
                  </div>

                  <div className="flex flex-col space-y-6">
                    <div>
                      <h1 className="font-semibold text-sm">
                        ক্যাফেটেরিয়ার তথ্য প্রদান করুন
                      </h1>
                    </div>
                    <div className="space-y-2 ">
                      <div className="space-y-2 ">
                        <Label className="text-xs" htmlFor="name">
                          নাম
                        </Label>
                        <Input
                          id="name"
                          type="name"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="address">
                          ঠিকানা
                        </Label>
                        <Input
                          id="address"
                          type="address"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="address"
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
                      className="  hover:transition-all hover:delay-100"
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
