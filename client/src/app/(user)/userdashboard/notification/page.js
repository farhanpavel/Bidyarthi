"use client";

import { BellIcon, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function NotificationPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  // Open dialog if the `dialog` query parameter is present
  useEffect(() => {
    if (searchParams.get("dialog") === "true") {
      setDialogOpen(true);
    }
  }, [searchParams]); // Re-run effect when searchParams change

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      {/* Main Page Content */}

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

              {/* Example Notifications */}
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-bangla">
                    নতুন আপডেট: সিস্টেম রক্ষণাবেক্ষণ
                  </p>
                  <p className="text-xs text-gray-500 font-bangla">
                    ১০ মিনিট আগে
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-bangla">জরুরি: আবহাওয়া সতর্কতা</p>
                  <p className="text-xs text-gray-500 font-bangla">
                    ১ ঘন্টা আগে
                  </p>
                </div>
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
