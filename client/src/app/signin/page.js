"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Signin() {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <div className="container mx-auto font-bangla">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[80%] sm:w-3/4 m-auto flex flex-wrap sm:flex-nowrap shadow-lg shadow-pink-200 justify-around text-center p-16">
          <div className="space-y-7 flex flex-wrap flex-col justify-center items-center">
            <div>
              <Image
                src="/images/logo.png"
                width={200}
                height={200}
                alt="logo"
              />
            </div>
            <div className="text-center space-y-1 2xl:text-2xl text-md text-xl">
              <h1>বিদ্ধার্থী অ্যাপে স্বাগতম!</h1>
              <p className="text-sm">আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন</p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-2">
                {/* Email Input Field with Motion Effect */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ইমেইল"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                  {isEmailFocused && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>

                {/* Password Input Field with Motion Effect */}
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="পাসওয়ার্ড"
                    name="password"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  {isPasswordFocused && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>

                <div className="space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E54981] w-1/3 text-sm text-white rounded-full mt-2"
                  >
                    লগইন
                  </button>
                </div>
              </form>
              <div>
                <h1 className="text-sm text-center mt-4">
                  পাসওয়ার্ড ভুলে গেছেন?
                  <Link
                    href={"/signup"}
                    className="font-bold mx-1 text-[#E54981]"
                  >
                    সাইনআপ
                  </Link>
                </h1>
              </div>
            </div>
          </div>
          <div className="order-first sm:order-last lg:flex items-center hidden">
            <Image
              src="/images/signin.gif"
              width={500}
              height={400}
              alt="logo"
              className="lg:w-[400px] md:w-[300px] 2xl:w-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
