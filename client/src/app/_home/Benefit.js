import React from "react";
import { RiSwitchFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { IoIosBook } from "react-icons/io";
import { FaPaperPlane } from "react-icons/fa";
export default function Benefit() {
  return (
    <div className="font-bangla container mx-auto">
      <div className="text-center space-y-4 te">
        <h1 className="text-3xl font-bold">
          বিশ্ববিদ্যালয় সেবার অল-ইন-ওয়ান সমাধান
        </h1>
        <p className="text-[#504D4E]">
          একই প্ল্যাটফর্মে ক্লাস রুটিন, বাস সময়সূচি, <br /> ক্যাফেটেরিয়া মেনু,
          এবং আরও অনেক কিছু।
        </p>
      </div>
      <div className="flex justify-around">
        <h1 className="bg-[#E54981] rounded-full w-4 h-4"></h1>
        <h1 className="bg-purple-700 rounded-full w-8 h-8 mt-10"></h1>
      </div>
      <div className="grid grid-cols-4 p-6 gap-4">
        <div className="shadow-xl space-y-4 p-8 rounded-lg bg-[#ED4883] text-white">
          <FaPaperPlane className="text-5xl bg-white text-[#ED4883] p-3 rounded-lg" />
          <div className="space-y-2 rounded-lg">
            <h1 className="font-bold text-lg">বিশ্ববিদ্যালয় ইভেন্ট</h1>
            <p className="text-sm text-white">
              আসন্ন ইভেন্ট ও কার্যক্রম সম্পর্কে <br /> সর্বশেষ আপডেট পান।
            </p>
          </div>
        </div>
        <div className="shadow-md bg-white space-y-4 p-8 rounded-lg">
          <RiSwitchFill className="text-5xl bg-purple-700 text-white p-3 rounded-lg" />
          <div className="space-y-2 rounded-lg">
            <h1 className="font-bold text-lg">ক্লাস রুটিন</h1>
            <p className="text-sm text-[#504D4E]">
              সহজেই ক্লাস সময়সূচি দেখুন, <br /> পরীক্ষার তারিখ ও অ্যাসাইনমেন্ট
              ডেডলাইন ট্র্যাক করুন।
            </p>
          </div>
        </div>
        <div className="shadow-md bg-white space-y-4 p-8 rounded-lg">
          <IoIosBook className="text-5xl bg-[#EC732F] text-white p-3 rounded-lg" />
          <div className="space-y-2 rounded-lg">
            <h1 className="font-bold text-lg">লাইব্রেরি ও নোট</h1>
            <p className="text-sm text-[#504D4E]">
              প্রয়োজনীয় বই ও লেকচার নোট <br /> এক ক্লিকে অ্যাক্সেস করুন।
            </p>
          </div>
        </div>
        <div className="shadow-md bg-white space-y-4 p-8 rounded-lg">
          <FaUserCircle className="text-5xl bg-[#417CD4] text-white p-3 rounded-lg" />
          <div className="space-y-2 rounded-lg">
            <h1 className="font-bold text-lg">শিক্ষক ও সহপাঠীদের সংযোগ</h1>
            <p className="text-sm text-[#504D4E]">
              শিক্ষক ও বন্ধুদের সাথে <br /> সরাসরি যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
