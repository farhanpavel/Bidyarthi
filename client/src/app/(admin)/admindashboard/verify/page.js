"use client";
import { UserPlus, Loader2, SquarePen, QrCode } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [regNo, setRegNo] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (!regNo) {
      toast.error("Please enter a registration number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${url}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regNo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      alert("Registration number verified successfully");
      router.back();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <QrCode className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">
            রেজিস্ট্রেশন নম্বর যাচাই করুন
          </h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          নিচে রেজিস্ট্রেশন নম্বর প্রবেশ করান
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle className="font-bangla">রেজিস্ট্রেশন নম্বর</CardTitle>
              <CardDescription className="font-bangla">
                দয়া করে রেজিস্ট্রেশন নম্বরটি সঠিকভাবে প্রবেশ করান
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bangla" htmlFor="regNo">
                      রেজিস্ট্রেশন নম্বর
                    </Label>
                    <Input
                      id="regNo"
                      type="text"
                      className="w-1/2 border-[1px] border-gray-600"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="রেজিস্ট্রেশন নম্বর লিখুন"
                      required
                    />
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-end mt-7 p-0">
                {isLoading ? (
                  <Button
                    type="button"
                    disabled
                    className="hover:transition-all hover:delay-100"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleVerify}
                    className="hover:transition-all hover:delay-100 font-bangla"
                  >
                    যাচাই করুন
                  </Button>
                )}
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
