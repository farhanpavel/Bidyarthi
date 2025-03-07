"use client";
import React, { useState } from "react";
import { Timer, Mail, Inbox, Send, X } from "lucide-react";

export default function page() {
  const [showCompose, setShowCompose] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="p-6 space-y-2">
          <div className="flex gap-x-2 items-center text-black">
            <Timer className="h-8 w-8" />
            <h1 className="text-2xl font-bold">সময়সূচী</h1>
          </div>
          <p className="text-sm text-gray-600 border-black border-b-[2px] pb-4">
            আপনার বাসসমূহ কার্যকরভাবে পরিচালনা করুন।
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-5 w-5" />
            Compose
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors">
            <Inbox className="h-5 w-5" />
            Inbox
          </button>
        </div>

        {/* Compose Email Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Compose Email</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="p-4 space-y-4">
                <div>
                  <label
                    htmlFor="to"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    To:
                  </label>
                  <input
                    type="email"
                    id="to"
                    value={emailData.to}
                    onChange={(e) =>
                      setEmailData({ ...emailData, to: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject:
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message:
                  </label>
                  <textarea
                    id="body"
                    value={emailData.body}
                    onChange={(e) =>
                      setEmailData({ ...emailData, body: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Placeholder for Inbox Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inbox</h2>
          <p className="text-gray-500">No messages yet</p>
        </div>
      </div>
    </div>
  );
}
