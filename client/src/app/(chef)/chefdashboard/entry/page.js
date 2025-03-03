"use client";
import { Button } from "@/components/ui/button";
import { HandPlatter, Star, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();
  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <HandPlatter className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4 font-bangla">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>
        <div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                router.push("/chefdashboard/entry/new");
              }}
              variant="default"
            >
              Create
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { src: "/images/meal2.jpg", title: "Breakfast" },
              { src: "/images/meal.png", title: "Lunch" },
              { src: "/images/breakfast.png", title: "Dinner" },
            ].map((item, index) => (
              <div key={index} className="relative w-full h-64">
                <Image
                  src={item.src}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  alt={item.title}
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-50 text-white p-4">
                  <h1 className="text-lg font-bold text-[#FC8A06]">
                    {item.title}
                  </h1>
                  <p className="text-xs text-left">
                    Lorem ipsum dolor sit amet consectetur.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-center">
              <h1 className="text-xl text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black inline-block">
                Breakfast
              </h1>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white shadow-xl p-5 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Image src={"/images/demo.png"} width={200} height={200} />
                  </div>
                  <div className="w-1/2">
                    <p className="text-xl ">Ramachandra Parlour</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs">
                      <p>South Indian</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#1AC84B] fill-[#1AC84B]" />
                      <p className="text-xs">4</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs space-x-1">
                      <HandPlatter className="w-4 h-4 text-[#FC8019]" />
                      <h1>30 Mins</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>200 for two</h1>
                    </div>
                  </div>
                </div>
              </div>
              {/* two */}
              <div className="bg-white shadow-xl p-5 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Image src={"/images/demo.png"} width={200} height={200} />
                  </div>
                  <div className="w-1/2">
                    <p className="text-xl ">Ramachandra Parlour</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs">
                      <p>South Indian</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#1AC84B] fill-[#1AC84B]" />
                      <p className="text-xs">4</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs space-x-1">
                      <HandPlatter className="w-4 h-4 text-[#FC8019]" />
                      <h1>30 Mins</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>200 for two</h1>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="bg-white shadow-xl p-5 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Image src={"/images/demo.png"} width={200} height={200} />
                  </div>
                  <div className="w-1/2">
                    <p className="text-xl ">Ramachandra Parlour</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs">
                      <p>South Indian</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#1AC84B] fill-[#1AC84B]" />
                      <p className="text-xs">4</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs space-x-1">
                      <HandPlatter className="w-4 h-4 text-[#FC8019]" />
                      <h1>30 Mins</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>200 for two</h1>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="bg-white shadow-xl p-5 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <Image src={"/images/demo.png"} width={200} height={200} />
                  </div>
                  <div className="w-1/2">
                    <p className="text-xl ">Ramachandra Parlour</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs">
                      <p>South Indian</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#1AC84B] fill-[#1AC84B]" />
                      <p className="text-xs">4</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs space-x-1">
                      <HandPlatter className="w-4 h-4 text-[#FC8019]" />
                      <h1>30 Mins</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>200 for two</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
