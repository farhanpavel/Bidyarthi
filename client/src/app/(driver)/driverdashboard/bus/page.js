"use client";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import { HandPlatter, Map, Users, DollarSign, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState([]); // State to store fetched meals
  var token = Cookies.get("token");
  // Fetch meals from the API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${url}/api/bus/assigned/get`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Timer className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">সময়সূচী</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার বাসসমূহ কার্যকরভাবে পরিচালনা করুন।
        </p>
        <div>
          {/* All Buses Section */}
          <div className="mt-4">
            <div className="flex justify-center">
              <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
                বরাদ্দকৃত বাসসমূহ
              </h1>
            </div>
            <div className="flex flex-col">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white shadow-xl py-3 px-5 rounded-lg flex flex-row gap-6 my-2"
                >
                  {/* Image on the left */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        "https://i.ibb.co.com/ZpbRV8sY/Screenshot-2025-03-04-at-02-33-40.png"
                      }
                      alt={meal.busNum}
                      width={80}
                      height={800}
                      className="rounded-lg object-cover w-[80px] h-[80px]"
                    />
                  </div>

                  {/* Content on the right */}
                  <div className="flex flex-row justify-between items-center w-full">
                    {/* Bus Route */}
                    <div className="space-y-1">
                      <p className="text-xl font-semibold">
                        {meal.startPoint} → {meal.endPoint}
                      </p>
                      <p className="text-sm text-gray-600">{meal.routeName}</p>
                    </div>

                    {/* Bus Number */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        বাস নম্বর
                      </p>
                      <p className="text-lg font-bold">{meal.busNum}</p>
                    </div>

                    {/* Departure Time */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        প্রস্থান সময়
                      </p>
                      <p className="text-lg font-bold">{meal.schedule}</p>
                    </div>

                    {/* Manage Button */}
                    <div className="space-y-1">
                      <Button
                        onClick={() =>
                          router.push(`/driverdashboard/bus/${meal.id}`)
                        }
                        className="bg-black text-white px-6 py-2 rounded-lg font-semibold shadow-lg"
                      >
                        পরিচালনা করুন
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
