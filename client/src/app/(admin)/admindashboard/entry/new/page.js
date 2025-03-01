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
          <h1 className="text-2xl font-bold">Entry</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4">
          Create a perfect roadmap for your learning
        </p>
        <div>
          <Card className="border-[1px] border-gray-300">
            <CardHeader className="space-y-4">
              <CardTitle>Police Details</CardTitle>
              <CardDescription>
                Please select the Post of the police and fill in the required
                information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col w-1/4 space-y-3">
                    <Label htmlFor="framework" className="text-xs">
                      Select role
                    </Label>
                    <Select required>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Sub Inspector">
                          Sub Inspector
                        </SelectItem>
                        <SelectItem value="ASP">ASP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-6">
                    <div>
                      <h1 className="font-semibold text-sm">
                        Enter Police Informations
                      </h1>
                    </div>
                    <div className="space-y-2 ">
                      <div className="space-y-2 ">
                        <Label className="text-xs" htmlFor="name">
                          Name
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
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs" htmlFor="password">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          className="w-1/2 border-[1px] border-gray-600"
                          name="password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
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
                      </div>
                      <div className="space-y-2">
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
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-7">
                  <Button
                    type="submit"
                    variant="default"
                    className="hover:transition-all hover:delay-100"
                  >
                    Submit
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
