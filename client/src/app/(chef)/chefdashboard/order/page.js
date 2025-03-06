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
import Cookies from "js-cookie";
export default function Page() {
  const [orders, setOrders] = useState([]);
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  const [chefId, setChefId] = useState("");
  const { message } = useContext(MessageContext);
  let token = Cookies.get("token");
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
            Authorization: token,
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
          Authorization: token,
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
          <h1 className="text-2xl font-bold font-bangla">অর্ডারসমূহ</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4">
          কাস্টমারদের অর্ডারগুলো দেখুন
        </p>
        <div>
          <Table>
            <TableCaption>পেন্ডিং অর্ডারসমূহের তালিকা</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>কাস্টমারের নাম</TableHead>
                <TableHead>অর্ডারকৃত মিল</TableHead>
                <TableHead>পরিমান</TableHead>
                <TableHead>পেমেন্ট স্ট্যাটাস</TableHead>
                <TableHead>প্রি-অর্ডার</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
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
                        <Badge className="bg-green-600 text-white">পেইড</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white">আনপেইড</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.preOrder ? (
                        <Badge className="bg-blue-600 text-white">
                          প্রি-অর্ডার
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-white">
                          রেগুলার
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
                        গ্রহণ
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
                        প্রত্যাখ্যান
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>মোট অর্ডার</TableCell>
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
