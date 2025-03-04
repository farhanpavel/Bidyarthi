"use client";
import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { url } from "@/components/Url/page";

export default function Page() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/api/meal/data/chef/pendingdata`, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NjJhZGM5LWNjZjYtNDBmOS1iYzgyLWQ1ODVkNmU0ZmVjZSIsImVtYWlsIjoiZmFyaGFucGF2ZWwzQGdtYWlsLmNvbSIsImlhdCI6MTc0MTA5Njk5MSwiZXhwIjoxNzQxNzAxNzkxfQ.1kQfTuc4ZBk9KA5Kp_JtbCygYzVyE1DQe77Fqg0UTdk",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderAction = async (
    orderId,
    preOrder,
    paid,
    quantity,
    menuId
  ) => {
    let apiEndpoint = "";
    let method = "";
    let body = null;

    if (preOrder && !paid) {
      // Send PUT request with quantity
      apiEndpoint = `${url}/api/meal/${menuId}`;
      method = "PUT";
      body = JSON.stringify({ quantity, orderId });
    } else if (!preOrder && paid) {
      // Send DELETE request with no body
      apiEndpoint = `${url}/api/meal/${orderId}`;
      method = "DELETE";
    }

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NjJhZGM5LWNjZjYtNDBmOS1iYzgyLWQ1ODVkNmU0ZmVjZSIsImVtYWlsIjoiZmFyaGFucGF2ZWwzQGdtYWlsLmNvbSIsImlhdCI6MTc0MTA5Njk5MSwiZXhwIjoxNzQxNzAxNzkxfQ.1kQfTuc4ZBk9KA5Kp_JtbCygYzVyE1DQe77Fqg0UTdk",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Failed to process order");
      }

      setOrders((prevOrders) => {
        return prevOrders.map((order) => ({
          ...order,
          orders: order.orders.filter((item) => item.id !== orderId),
        }));
      });

      console.log("Order processed:", orderId);
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <UserPlus className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">প্রবেশ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          আপনার শিক্ষার জন্য একটি নিখুঁত রোডম্যাপ তৈরি করুন।
        </p>
        <div>
          <Table>
            <TableCaption>A list of pending orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Meal Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Pre Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) =>
                order.orders.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>{order.mealName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.paid ? (
                        <Badge className="bg-green-600 text-white">Paid</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.preOrder ? (
                        <Badge className="bg-blue-600 text-white">
                          Pre Order
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          handleOrderAction(
                            item.id,
                            item.preOrder,
                            item.paid,
                            item.quantity,
                            item.menuId
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() =>
                          handleOrderAction(
                            item.id,
                            item.preOrder,
                            item.paid,
                            item.quantity,
                            item.menuId
                          )
                        }
                      >
                        Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total Orders</TableCell>
                <TableCell className="text-right">
                  {orders.reduce(
                    (total, order) => total + order.orders.length,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
