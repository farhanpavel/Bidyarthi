"use client";

import {
  DollarSign,
  HandPlatter,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
export default function Page() {
  const { id } = useParams(); 
  const [meal, setMeal] = useState(null); 
  const [cartItems, setCartItems] = useState([]); 
  const router = useRouter();
  var token = Cookies.get("token");
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`${url}/api/meal/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meal data");
        }
        const data = await response.json();
        setMeal(data[0]); 

        setCartItems([
          {
            id: data[0].id,
            name: data[0].mealName,
            price: data[0].price,
            quantity: 1, 
            image: data[0].meal_url,
            mealType: data[0].mealType,
          },
        ]);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMeal();
  }, [id]);


  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const deliveryFee = 2.99;
  const tax = calculateSubtotal() * 0.08;

  if (!meal) {
    return <div>Loading...</div>; 
  }
  const handlePay = async () => {
    const totalAmount = calculateSubtotal() + deliveryFee + tax;

    const payload = {
      amount: totalAmount,
      menuId: id,
      quantity: cartItems[0].quantity,
    };

    try {
      const response = await fetch(`${url}/api/meal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload), 
      });

      const result = await response.json();
      if (response.ok) {
        router.back();
      } else {
        console.error("Payment initiation failed:", result.error);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex gap-x-2 items-center text-black">
        <HandPlatter className="h-8 w-8" />
        <h1 className="text-2xl font-bold font-bangla">খাবার</h1>
      </div>
      <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
      আপনার পছন্দের খাবার
      </p>

      <Card className="bg-[#202020] border-none overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative h-48 md:h-full">
            <img
              src={meal.meal_url} 
              fill
              style={{ objectFit: "cover" }}
              alt="food"
              className="brightness-90"
            />
          </div>
          <div className="text-white flex flex-col justify-center p-6 md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{meal.mealName}</h1>{" "}
              
                <p className="text-gray-300">{meal.description}</p>{" "}
            
              </div>
            </div>

            <div className="text-white flex flex-wrap gap-6 mt-5">
              <div className="flex items-center">
                <h1 className="mr-1">{meal.price}</h1>{" "}
                
                <DollarSign className="w-4 h-4 text-[#1AC84B]" />
              </div>
              <div>
                <h1 className="font-medium">{meal.quantity} mins</h1>{" "}
             
                <p className="text-sm text-gray-400 font-bangla">ডেলিভারি সময়</p>
              </div>
              <div>
                <h1 className="font-medium font-bangla">খাবারের ধরণ</h1>
                <p className="text-sm text-gray-400">{meal.mealType}</p>{" "}
             
              </div>
            </div>
          </div>
        </div>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold font-bangla">আপনার কার্ট</h2>
              </div>
              <Badge variant="secondary">{cartItems.length} আইটেমস</Badge>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium font-bangla">আপনার কার্ট খালি</h3>
                  <p className="text-muted-foreground mt-1 font-bangla">
                  শুরু করতে কিছু সুস্বাদু আইটেম যোগ করুন
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground text-sm font-bangla">
                        ধরণ: {item.mealType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>


        <div>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>
                  ${(calculateSubtotal() + deliveryFee + tax).toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={(e) => handlePay(e)}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
