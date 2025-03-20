"use client";

import { HandPlatter, Star, Users, Map, DollarSign } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
export default function Page() {
  const [meals, setMeals] = useState([]);
  var token = Cookies.get("token");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${url}/api/meal/data/end`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch meal data");
        }

        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <HandPlatter className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">খাবার</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার পছন্দের খাবার
        </p>

        <div>
          <div className="mt-2">
            <div className="flex justify-center">
              <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black font-bangla">
                অনুরোধকৃত অর্ডার
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white shadow-xl p-5 rounded-lg flex flex-col justify-between h-full"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-center">
                    <img
                      src={meal.menu.meal_url}
                      alt={meal.menu.mealName}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-[200px] h-[200px]"
                    />
                  </div>

                  <div className="flex justify-between items-center w-full ">
                    <div className="truncate space-y-1">
                      <p className="text-xl font-semibold">
                        {meal.menu.mealName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {meal.menu.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full">
                    <p className="text-xs">{meal.menu.mealType}</p>
                    <div className="flex items-center">
                      <p className="text-xs font-bold">
                        ${(meal.menu.price * meal.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center text-xs space-x-1 truncate">
                      <Map className="w-4 h-4 text-[#FC8019]" />
                      <h1>{meal.menu.user.chefAssignment.restaurant.name}</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>{meal.quantity}</h1>
                    </div>
                  </div>

                  <div className="space-x-1 flex flex-wrap justify-end">
                    <Badge className="bg-green-600 text-white">
                      {meal.status ? "Taken" : "Pending"}
                    </Badge>
                    <Badge className="bg-red-600 text-white">
                      {meal.paid ? "Online Payment" : "Preorder"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
