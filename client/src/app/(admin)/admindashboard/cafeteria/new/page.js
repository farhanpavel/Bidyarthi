import { UserPlus } from "lucide-react";
import React from "react";
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
export default function page() {
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
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-1/5 space-y-3">
                    <Input type="file" className="border-gray-600" />
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
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="email">
                          ঠিকানা
                        </Label>
                        <Input
                          id="address"
                          type="address"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="address"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="password">
                          ক্যাফে ইউআরএল
                        </Label>
                        <Input
                          type="cafe_url"
                          id="cafe_url"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="cafe_url"
                          required
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label className="text-xs" htmlFor="password">
                          Mobile No
                        </Label>
                        <Input
                          type="number"
                          id="mobile"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="mobile"
                          required
                        />
                      </div> */}
                      {/* <div className="space-y-2">
                        <Label className="text-xs" htmlFor="password">
                          Thana
                        </Label>
                        <Input
                          type="name"
                          id="thana"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="thana"
                          required
                        />
                      </div> */}
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
