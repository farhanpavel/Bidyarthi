"use client";
import { UserPlus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
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
import useFcmToken from "@/utils/hooks/useFcmToken";
import { subscribeTokenToTopic } from "@/utils/wrapper/FCMWrapper";
import { toast } from "react-toastify";
import { MessageContext } from "@/utils/context/MessageContext";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const [chefId, setChefId] = useState("");
  const { message } = useContext(MessageContext);

  // Subscribe to FCM topic when fcmToken and chefId are available
  useEffect(() => {
    if (fcmToken && chefId) {
      console.log("FCM token chef:", fcmToken);
      subscribeTokenToTopic(fcmToken, `chef-${chefId}`);
    }
  }, [fcmToken, chefId]);

  useEffect(() => {
    if (message) {
      console.log("Message received: ", message);

      if (message.data?.topic === `chef-${chefId}`) {
        const { topic, ...rest } = message.data;

        // Create a new order object from the message data
        const newOrder = {
          id: rest.orderId, // Ensure the backend sends an orderId
          userId: rest.userId, // Ensure the backend sends a userId
          menuId: rest.menuId, // Ensure the backend sends a menuId
          quantity: Number(rest.quantity), // Convert to number
          paid: rest.paid === "true", // Convert to boolean
          preOrder: rest.preOrder === "true", // Convert to boolean
          user: {
            name: rest.userName,
          },
        };

        // Update the orders state with the new order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === rest.menuId
              ? {
                  ...order,
                  orders: [...order.orders, newOrder], // Add the new order to the meal's orders array
                }
              : order
          )
        );

        // Show a toast notification
        toast.success(
          <div>
            <strong>New Order Update:</strong>
            <p>{`Meal: ${rest.mealName}, Quantity: ${rest.quantity}`}</p>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else {
        console.log("Topic not matched");
        console.log("topic: ", message.data?.topic);
      }
    }
  }, [message, chefId]);
  // Fetch initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/api/meal/data/chef/pendingdata`, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3NjQwMTZiLTJiMjItNDIyZC1iMGNlLTUwNmIwMTQzMmU3MyIsImVtYWlsIjoia2luZ0BnbWFpbC5jb20iLCJpYXQiOjE3NDExMTMzMTcsImV4cCI6MTc0MTcxODExN30.J-InsQVfKOFEdXwAKTWlIM3A9u9KlVw8jss_CF305Dw",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log(data);
        setOrders(data);
        if (data.length > 0) {
          setChefId(data[0].user_id);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Handle order actions (accept/decline)
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
      apiEndpoint = `${url}/api/meal/${menuId}`;
      method = "PUT";
      body = JSON.stringify({ quantity, orderId });
    } else if (!preOrder && paid) {
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
