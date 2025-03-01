import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { FaAmazon } from "react-icons/fa6";
import { SiAdidas } from "react-icons/si";
import { SiDell } from "react-icons/si";
import { GrHpi } from "react-icons/gr";
export default function Hero() {
  return (
    <div>
      <div className="mt-6 font-bangla container mx-auto">
        <div className="text-center space-y-5">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-[3.6rem]">
              বিশ্ববিদ্যালয় জীবনকে সহজ করুন <br /> এক প্ল্যাটফর্মেই সব সুবিধা
            </h1>
            <p>
              একাধিক অ্যাপে সময় নষ্ট নয়, <br /> এখন ক্লাস রুটিন, বাস শিডিউল ও
              ইভেন্ট সব একসাথে!
            </p>
          </div>

          <div className="space-x-5">
            <Button className="rounded-full px-6 bg-yellow-500 text-white hover:bg-yellow-500">
              সাইন ইন
            </Button>
            <Button className="rounded-full px-6 border-yellow-500 bg-white border-2 text-yellow-500 hover:bg-white hover:text-yellow-500">
              সাইন আপ
            </Button>
          </div>
        </div>
        <div className="flex justify-evenly p-6">
          <div className="relative -mt-24 text-center">
            <h1 className="bg-[#E54981] rounded-full w-4 h-4"></h1>
            <Image
              src={"/images/image1.png"}
              width={170}
              height={170}
              alt="hero1"
            />
            <h1 className="bg-[#417CD4] rounded-full w-6 h-6"></h1>
          </div>
          <div>
            <Image
              src={"/images/image2.png"}
              width={170}
              height={170}
              alt="hero2"
            />
            <h1 className="bg-[#FFBA00] rounded-full w-8 h-8 "></h1>
          </div>
          <div>
            <h1 className="bg-[#00C3A5] rounded-full w-6 h-6"></h1>
            <Image
              src={"/images/image3.png"}
              width={170}
              height={170}
              alt="hero3"
            />
          </div>
          <div className="relative -mt-24 text-center">
            <h1 className="bg-purple-600 rounded-full w-6 h-6 absolute left-0 transform -translate-y-1/2"></h1>
            <Image
              src={"/images/image4.png"}
              width={170}
              height={170}
              alt="hero4"
            />
            <h1 className="bg-[#DD3F3F] rounded-full w-6 h-6 absolute right-0  transform -translate-y-1/2"></h1>
          </div>
        </div>
        <div className="p-5 space-y-10">
          <div className="text-center text-[#504D4E] mt-4 font-medium">
            <p>বিভিন্ন ইউনিকর্ন কোম্পানির বিশ্বস্ত পছন্দ</p>
          </div>

          <div className="flex justify-evenly">
            {/* Google Icon */}
            <div className="group">
              <FaGoogle className="text-4xl text-[#f42727]" />
            </div>

            {/* Meta Icon */}
            <div className="group">
              <FaMeta className="text-4xl text-[#1877F2]" />
            </div>

            {/* Amazon Icon */}
            <div className="group">
              <FaAmazon className="text-4xl text-[#FF9900]" />
            </div>

            {/* Adidas Icon */}
            <div className="group">
              <SiAdidas className="text-4xl text-[#000000]" />
            </div>

            {/* Dell Icon */}
            <div className="group">
              <SiDell className="text-4xl text-[#007DB8]" />
            </div>

            {/* HP Icon */}
            <div className="group">
              <GrHpi className="text-4xl text-[#0096D6]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
