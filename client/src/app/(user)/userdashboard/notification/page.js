"use client";

import { BellIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { url } from "@/components/Url/page";

export default function NotificationPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const pathname = usePathname(); // Get the current path

  // Extract query parameter manually
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("dialog") === "true") {
        setDialogOpen(true);
      }
    }
  }, [pathname]); // Re-run when pathname changes

  // Fetch notifications
  const fetchNotifications = async () => {
    const response = await fetch(`${url}/api/emergency`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    if (response.ok) setNotifications(json);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Format date
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
            <button
              onClick={closeDialog}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex gap-x-2 items-center text-black">
              <BellIcon className="text-3xl" />
              <h1 className="text-2xl font-bold font-bangla">
                নোটিফিকেশন প্যানেল
              </h1>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-600 font-bangla">
                জরুরি আপডেট এবং নোটিফিকেশনগুলি এখানে পাবেন
              </p>
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
