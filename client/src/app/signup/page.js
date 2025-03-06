"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: "student" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }

      console.log("Registration successful:", data);
      router.push("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto font-bangla p-6">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[80%] sm:w-3/4 m-auto flex flex-wrap sm:flex-nowrap shadow-lg shadow-pink-200 justify-around text-center p-16">
          <div className="space-y-7 flex flex-wrap flex-col justify-center items-center w-[40%]">
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
              <p className="text-sm">অ্যাকাউন্ট তৈরি করতে সাইনআপ করুন</p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="নাম"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={() => setIsNameFocused(false)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="ইমেইল"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent"
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E54981] w-1/3 text-sm text-white rounded-full mt-2"
                    disabled={loading}
                  >
                    {loading ? "সাইনআপ হচ্ছে..." : "রেজিস্টার"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="order-first sm:order-last lg:flex items-center hidden">
            <Image
              src="/images/signup.gif"
              width={400}
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
