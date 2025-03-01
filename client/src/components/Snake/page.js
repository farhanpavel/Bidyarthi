"use client";

import React from "react";
import { motion } from "framer-motion";
import { LightbulbIcon, SunIcon, ZapIcon } from "lucide-react";
import { FaBus } from "react-icons/fa";
export default function Snake() {
  const benefits = [
    {
      icon: <LightbulbIcon className="h-6 w-6 text-white" />,
      title: "আপনার পরীক্ষার প্রস্তুতি বাড়ান",
      description:
        "বিদ্ধার্থী আপনাকে পরীক্ষা প্রস্তুতির জন্য প্রয়োজনীয় সরঞ্জাম এবং সংস্থানগুলি প্রদান করে। কাস্টমাইজড কুইজ, ছাত্র ব্যবস্থাপনা, এবং পরীক্ষার ট্র্যাকিং বৈশিষ্ট্যগুলির সাথে, বিদ্ধার্থী শিক্ষক এবং শিক্ষার্থীদের জন্য একটি নিরাপদ এবং কার্যকর পরীক্ষার অভিজ্ঞতা নিশ্চিত করে।",
      position: "left",
      bgColor: "bg-purple-600", // Custom color for the icon background
    },
    {
      icon: <FaBus className="h-6 w-6 text-white" />,
      title: "আপনার পরীক্ষার পারফরম্যান্স মনিটর করুন",
      description:
        "বিদ্ধার্থী আপনাকে আপনার পরীক্ষার পারফরম্যান্স ট্র্যাক করতে এবং আপনার অগ্রগতি দেখতে সহায়তা করে। আমাদের পারফরম্যান্স ট্র্যাকিং বৈশিষ্ট্যটি আপনাকে ফলাফল মনিটর করতে, শক্তি এবং দুর্বলতা চিহ্নিত করতে এবং উন্নতির জন্য ক্ষেত্রগুলি ফোকাস করতে সহায়তা করে।",
      position: "right",
      bgColor: "bg-rose-700", // Custom color for the icon background
    },
    {
      icon: <ZapIcon className="h-6 w-6 text-white" />,
      title: "সহজ কুইজগ্র্যাড ইন্টিগ্রেশন",
      description:
        "বিদ্ধার্থী আপনার বিদ্যমান সিস্টেমগুলির সাথে মসৃণভাবে ইন্টিগ্রেট করে, কুইজ এবং ছাত্রদের পরিচালনা করার প্রক্রিয়াটি সরল করে। এই ইন্টিগ্রেশনটি নিশ্চিত করে যে শিক্ষক এবং শিক্ষার্থীরা কোনও ঝামেলা ছাড়াই সর্বশেষ কুইজ এবং পরীক্ষার সংস্থানগুলি অ্যাক্সেস করতে পারে।",
      position: "left",
      bgColor: "bg-[#ED4883]", // Custom color for the icon background
    },
  ];

  return (
    <div>
      <h1 className="bg-blue-500 rounded-full w-3 h-3 mx-20"></h1>

      <div className="container mx-auto px-4 py-16">
        <div className="relative max-w-3xl mx-auto">
          {/* Center timeline */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 border-dashed border-2 border-gray-700 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-16 md:space-y-24 relative">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Mobile view (stacked) */}
                <div className="flex gap-6 md:hidden">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-[44px] w-[44px] rounded-full border-2 border-dotted border-[#FFC727] flex justify-center items-center ${benefit.bgColor} z-10`}
                    >
                      {benefit.icon}
                    </div>
                    {index < benefits.length - 1 && (
                      <div className="w-1 h-full border-l-2 border-dotted border-[#FFC727] flex-grow mt-2"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="mb-2 text-2xl lg:text-2xl font-semibold ">
                      {benefit.title}
                    </h2>
                    <p className="text-base lg:text-xs text-[#504D4E] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Desktop view (alternating) */}
                <div className="hidden md:grid md:grid-cols-[1fr,60px,1fr] md:gap-0 ">
                  {/* Left content */}
                  <div
                    className={`${
                      benefit.position === "left" ? "block" : "invisible"
                    } text-right pr-4`}
                  >
                    <h2 className="mb-2 text-2xl lg:text-2xl font-semibold ">
                      {benefit.title}
                    </h2>
                    <p className="text-base lg:text-xs text-[#504D4E] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Center icon */}
                  <div className="flex justify-center">
                    <div
                      className={`h-[50px] w-[50px] rounded-full  flex justify-center items-center ${benefit.bgColor} z-10`}
                    >
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Right content */}
                  <div
                    className={`${
                      benefit.position === "right" ? "block" : "invisible"
                    } text-left pl-4`}
                  >
                    <h2 className="mb-2 text-2xl lg:text-2xl font-semibold ">
                      {benefit.title}
                    </h2>
                    <p className="text-base lg:text-xs text-[#504D4E] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <h1 className="bg-red-500 rounded-full w-8 h-8 mx-20"></h1>
          </div>
        </div>
      </div>
    </div>
  );
}
