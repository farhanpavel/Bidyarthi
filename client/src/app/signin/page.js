"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import ButtonLoader from "@/components/ButtonLoader/page";
import { Button } from "@/components/ui/button";

export default function Signin() {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isvalid, setvalid] = useState(false);
  const [isLogged, setLogged] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${url}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setvalid(true);

        throw new Error(data || "Login failed");
      }
      setvalid(false);
      setLogged(true);

      setTimeout(() => {
        Cookies.set("token", data.token.accessToken);
        Cookies.set("role", data.role);

        console.log("Login successful:", data);

        if (data.role === "admin") {
          router.push("/admindashboard/entry");
        } else if (data.role === "Cafeteriachef") {
          router.push("/chefdashboard/entry");
        } else if (data.role === "Busdriver") {
          router.push("/driverdashboard/bus");
        } else if (data.role === "Clubpresident") {
          router.push("/clubdashboard/event");
        } else if (data.role === "student") {
          router.push("/userdashboard/meal");
        }
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };

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
              <h1 className="font-bangla">বিদ্যার্থী অ্যাপে স্বাগতম!</h1>
              <p className="text-sm font-bangla">
                আপনার অ্যাকাউন্টে প্রবেশ করতে লগইন করুন
              </p>
            </div>
            <div className="2xl:w-3/4 w-full">
              <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
                {/* Email Input Field with Motion Effect */}
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ইমেইল"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                {isvalid && (
                  <div className="text-left text-sm text-red-600 mx-1">
                    <p className="font-bangla">সঠিক ইমেইল নয়</p>
                  </div>
                )}
                {/* Password Input Field with Motion Effect */}
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="পাসওয়ার্ড"
                    name="password"
                    className="w-full p-2 border-0 border-b-2 border-gray-300 focus:outline-none bg-transparent font-bangla"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                {isvalid && (
                  <div className="text-left text-sm text-red-600 mx-1">
                    <p className="font-bangla">সঠিক পাসওয়ার্ড নয়</p>
                  </div>
                )}
                {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

                <div className="space-x-3">
                  <Button
                    type="submit"
                    className="px-7 py-2 bg-[#E54981] w-1/3 xl:w-[35%] text-sm text-white rounded-full mt-2 font-bangla"
                  >
                    {isLogged ? <ButtonLoader /> : "লগইন"}
                  </Button>
                </div>
              </form>
              <div>
                <h1 className="text-sm text-center mt-4 font-bangla">
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
