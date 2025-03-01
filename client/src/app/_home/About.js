import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <div>
      <div className="font-bangla container mx-auto">
        <h1 className="bg-yellow-700 rounded-full w-5 h-5 mx-5"></h1>

        <div className="flex justify-evenly items-center">
          <div className="w-1/3 flex flex-col justify-center mt-10">
            <h1 className="text-2xl font-bold">কেন আমাদের বেছে নেবেন?</h1>
            <div className="space-y-4 mt-3 text-[#504D4E]">
              <p className="text-sm">
                বিদ্ধার্থী একটি অল-ইন-ওয়ান বিশ্ববিদ্যালয় অ্যাপ, যা ছাত্রদের
                জন্য একক প্ল্যাটফর্মে ক্যাফেটেরিয়া মেনু, ক্লাস রুটিন, বাস
                সময়সূচি এবং ইভেন্ট ম্যানেজমেন্টের সুবিধা প্রদান করে।
              </p>
              <p className="text-sm">
                আমাদের অ্যাপটি রিয়েল-টাইম আপডেট, অটোমেশন, এবং AI-ভিত্তিক
                সুপারিশ প্রদান করে, যা ছাত্রদের দৈনন্দিন কাজ সহজ ও কার্যকরী করে
                তোলে।
              </p>
            </div>
          </div>

          <div className="relative w-[30%] flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center  rounded-lg"></div>

            <div className="relative">
              <Image
                src={"/images/feature.png"}
                width={350}
                height={350}
                alt="student"
                className="rounded-lg min-w-[350px] min-h-[350px]"
              />

              <div className="absolute bottom-4  transform -translate-x-1/2 bg-white shadow-xl px-10 py-2 rounded-lg text-center">
                <h1 className="font-bold">আব্দুল করিম</h1>
                <p className="text-sm">শিক্ষার্থী</p>
              </div>
            </div>
          </div>
        </div>
        <h1 className="bg-[#E54981] rounded-full w-7 h-7 mx-10"></h1>
      </div>
    </div>
  );
}
