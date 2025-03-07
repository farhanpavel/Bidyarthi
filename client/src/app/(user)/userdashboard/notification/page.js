"use client";

import { BellIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { url } from "@/components/Url/page";

export default function NotificationPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const response = await fetch(`${url}/api/emergency`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      setNotifications(json);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Open dialog if the `dialog` query parameter is present
  useEffect(() => {
    if (searchParams.get("dialog") === "true") {
      setDialogOpen(true);
    }
  }, [searchParams]); // Re-run effect when searchParams change

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  return (
      <div>
        {/* Dialog Box */}
        {isDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={closeDialog}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Dialog Header */}
                <div className="flex gap-x-2 items-center text-black">
                  <BellIcon className="text-3xl" />
                  <h1 className="text-2xl font-bold font-bangla">
                    নোটিফিকেশন প্যানেল
                  </h1>
                </div>

                {/* Dialog Content */}
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-gray-600 font-bangla">
                    আপনার জরুরি আপডেট এবং নোটিফিকেশনগুলি প্রদান করুন।
                  </p>

                  {/* Notifications List */}
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="p-3 bg-gray-50 rounded-md"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-bangla font-semibold">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 font-bangla">
                                    অবস্থান: {notification.location}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500 font-bangla">
                                  {formatDate(notification.createdAt)}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 font-bangla">
                                  ধরন: {notification.type}
                                </p>
                                {notification.type === "EMERGENCY" && (
                                    <p className="text-xs text-gray-600 font-bangla">
                                      জরুরি স্তর: {notification.emergencyLevel}
                                    </p>
                                )}
                              </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 font-bangla">
                          কোনো নোটিফিকেশন পাওয়া যায়নি।
                        </p>
                    )}
                  </div>
                </div>

                {/* Dialog Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                      onClick={closeDialog}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}