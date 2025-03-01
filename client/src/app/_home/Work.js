import Snake from "@/components/Snake/page";
import React from "react";

export default function Work() {
  return (
    <div className="font-bangla">
      <div>
        <div className="text-center w-1/2 mx-auto space-y-4">
          <h1 className="bg-blue-500 rounded-full w-3 h-3 mx-[30%]"></h1>
          <h1 className="text-2xl font-bold">
            কিভাবে বিদ্ধার্থী আপনাকে সাহায্য করতে পারে
          </h1>
          <p className="text-sm text-[#504D4E]">
            বিদ্ধার্থী অ্যাপটি আপনাকে আপনার ছাত্রদের দক্ষতা মূল্যায়ন করতে
            সাহায্য করবে, যাতে আপনি তাদের অগ্রগতি, ফলাফল এবং প্রয়োজনীয় সহায়তা
            সম্পর্কে ডেটা ইনসাইট পেতে পারেন। আমাদের অ্যাপটি আপনাকে শিক্ষার্থীদের
            জন্য শ্রেণীকক্ষের উপর ভিত্তি করে বিশ্লেষণ করতে সহায়ক হবে।
          </p>
          <h1 className="bg-[#FFBA00] rounded-full w-8 h-8 text-left mx-0"></h1>
        </div>
        <div>
          <Snake />
        </div>
      </div>
    </div>
  );
}
