"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import ButtonLoader from "@/components/ButtonLoader/page";

export default function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLogged, setLogged] = useState(false);
  const [checkpassword, setPassword] = useState(false);

  const handleChange = (e) => {
    setPassword(false);

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (user.password !== user.confirmPassword) {
      setPassword(true);
      return;
    }
    setPassword(false);

    try {
      const response = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, role: "student" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }
      setLogged(true);
      console.log("Registration successful:", data);
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err) {
      setError(err.message);
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
              <h1 className="font-bangla">বিদ্যার্থী অ্যাপে স্বাগতম!</h1>
              <p className="text-sm font-bangla">
                অ্যাকাউন্ট তৈরি করতে সাইনআপ করুন
              </p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="নাম"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    value={user.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="ইমেইল"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="পাসওয়ার্ড"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {checkpassword && (
                  <div className="text-left text-sm text-red-600 mx-1">
                    <p className="font-bangla">পাসওয়ার্ড মিলছে না</p>
                  </div>
                )}
                <div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E54981] w-1/3 text-sm text-white rounded-full mt-2 font-bangla"
                  >
                    {isLogged ? <ButtonLoader /> : "রেজিস্টার"}
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
