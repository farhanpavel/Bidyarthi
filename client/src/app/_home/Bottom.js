import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Bottom() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="bg-[#E54981] w-[40%] p-10 text-white space-y-5 flex justify-center flex-col rounded-l-lg">
          <h1 className="font-bold text-xl">বিদ্ধার্থী ব্যবহার শুরু করুন</h1>
          <p className="text-sm">
            বিদ্ধার্থী অ্যাপের সাহায্যে আপনার পড়াশোনা আরও সহজ ও কার্যকরী করুন।
            আপনার সমস্ত শিক্ষাগত তথ্য এক জায়গায় পাবেন।
          </p>
        </div>

        <div className="bg-[#220F48] w-[40%] p-10 space-y-5 text-white rounded-r-lg">
          <Input
            className="w-full px-4 py-3  rounded-sm placeholder-black bg-white text-black"
            placeholder="আপনার নাম লিখুন"
          />
          <Textarea
            className="w-full px-4 py-3 bg-white rounded-sm resize-none placeholder-black text-black"
            placeholder="আপনার বার্তা লিখুন"
          />
          <Button className="rounded-full px-6 bg-yellow-500  hover:bg-yellow-500">
            জমা দিন
          </Button>
        </div>
      </div>
    </div>
  );
}
