"use client";

import { HandPlatter, Star, Users, Map, DollarSign } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { url } from "@/components/Url/page";

export default function Page() {
  const [meals, setMeals] = useState([]); // State to store fetched meals

  // Fetch meals from the API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${url}/api/meal/data/end`, {
          method: "GET",
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5NjkzNDZmLTcyZTItNGViYi1iMTZjLWUyN2NiZGM1Mjk4ZiIsImVtYWlsIjoiaGltZWxAZ21haWwuY29tIiwiaWF0IjoxNzQxMDk3MDgzLCJleHAiOjE3NDE3MDE4ODN9.pgGPALuMp5zDHzjt87EEfOw5SICmNM-n-uJwahJTwp4",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch meal data");
        }

        const data = await response.json();
        setMeals(data); // Set the fetched data to state
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
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>

        <div>
          <div className="mt-2">
            <div className="flex justify-center">
              <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
                Requested Order
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {meals.map((meal) => (
              <div key={meal.id} className="bg-white shadow-xl p-5 rounded-lg">
                <div className="space-y-3">
                  {/* Meal Image */}
                  <div className="flex justify-center">
                    <img
                      src={meal.menu.meal_url}
                      alt={meal.menu.mealName}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-[200px] h-[200px]"
                    />
                  </div>

                  {/* Meal Name */}
                  <div className="w-1/2">
                    <p className="text-xl">{meal.menu.mealName}</p>
                  </div>
                  <div>
                    <p className="text-xs">{meal.menu.description}</p>
                  </div>

                  {/* Meal Type and Price */}
                  <div className="flex justify-between">
                    <div className="text-xs">
                      <p>{meal.menu.mealType}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-xs font-bold">
                        ${(meal.menu.price * meal.quantity).toFixed(2)}{" "}
                        {/* Calculate total price */}
                      </p>
                    </div>
                  </div>

                  {/* Restaurant Name and Quantity */}
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs space-x-1">
                      <Map className="w-4 h-4 text-[#FC8019]" />
                      <h1>{meal.menu.user.chefAssignment.restaurant.name}</h1>
                    </div>
                    <div className="flex items-center text-xs space-x-1">
                      <Users className="w-4 h-4 text-[#FC8019]" />
                      <h1>{meal.quantity}</h1>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-x-1 flex">
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
