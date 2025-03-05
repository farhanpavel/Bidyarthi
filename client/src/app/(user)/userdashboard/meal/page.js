"use client";
import { Button } from "@/components/ui/button";
import { HandPlatter, Map, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState([]); // State to store fetched meals

  // Fetch meals from the API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/meal");
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
          <HandPlatter className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>
        <div>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => {
                router.push("/userdashboard/meal/request");
              }}
              variant="default"
            >
              Requested
            </Button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[
              { src: "/images/meal2.jpg", title: "Breakfast" },
              { src: "/images/meal.png", title: "Lunch" },
              { src: "/images/breakfast.png", title: "Dinner" },
            ].map((item, index) => (
              <div key={index} className="relative w-full h-64">
                <Image
                  src={item.src}
                  fill
                  className="object-cover rounded-lg"
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

          {/* Menu Section */}
          <div className="mt-4">
            <div className="flex justify-center">
              <h1 className="text-xl inline-block text-[#504D4E] mb-4 text-center font-semibold border-b-4 border-black">
                Menu
              </h1>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white shadow-xl p-5 rounded-lg flex flex-col justify-between h-full"
                >
                  <div className="space-y-3 flex-grow">
                    {/* Meal Image */}
                    <div className="flex justify-center">
                      <img
                        src={meal.meal_url}
                        alt={meal.mealName}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-[200px] h-[200px]"
                      />
                    </div>

                    {/* Meal Details */}
                    <div className="flex justify-between items-center w-full">
                      <div className="space-y-1 w-full">
                        <p className="text-xl font-semibold truncate">
                          {meal.mealName}
                        </p>
                        <p className="text-xs truncate">{meal.description}</p>
                      </div>
                    </div>

                    {/* Meal Type and Price */}
                    <div className="flex justify-between items-center w-full">
                      <p className="text-xs">{meal.mealType}</p>
                      <div className="flex items-center">
                        <p className="text-xs font-bold">{meal.price}</p>
                        <DollarSign className="w-4 h-4 text-[#1AC84B]" />
                      </div>
                    </div>

                    {/* Restaurant Name and Quantity */}
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center text-xs space-x-1">
                        <Map className="w-4 h-4 text-[#FC8019]" />
                        <h1 className="truncate">
                          {meal.user.chefAssignment.restaurant.name}
                        </h1>
                      </div>
                      <div className="flex items-center text-xs space-x-1">
                        <Users className="w-4 h-4 text-[#FC8019]" />
                        <h1>{meal.quantity}</h1>
                      </div>
                    </div>
                  </div>

                  {/* Buttons - Always Aligned at the End */}
                  <div className="mt-5 flex justify-end w-full">
                    <Button
                      disabled={meal.quantity <= 0}
                      onClick={() => {
                        router.push(`/userdashboard/meal/order/${meal.id}`);
                      }}
                      className="bg-green-700 hover:bg-green-600"
                    >
                      Order
                    </Button>

                    <Button
                      className="bg-red-600 text-white ml-4"
                      disabled={meal.quantity > 0}
                      onClick={() => {
                        router.push(`/userdashboard/meal/preorder/${meal.id}`);
                      }}
                    >
                      Preorder
                    </Button>
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
