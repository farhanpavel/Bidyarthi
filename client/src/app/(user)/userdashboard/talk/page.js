"use client";
import React, { useEffect, useState } from "react";
import { Mail, Inbox, Send, X } from "lucide-react";
import Cookies from "js-cookie";
import { url } from "@/components/Url/page";

export default function Page() {
  const [showCompose, setShowCompose] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for sending email

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to fetch messages
  const fetchMessages = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(`${url}/api/mail/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setInbox(data); // Update inbox state with fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Start loading

    const token = Cookies.get("token");

    try {
      // Send a POST request to the API endpoint
      const response = await fetch(`${url}/api/mail/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          email: emailData.to, // Use the `to` field as the recipient email
          subject: emailData.subject,
          message: emailData.body,
        }),
      });

      // Parse the response
      const result = await response.json();

      if (response.ok) {
        // Handle success
        alert("Email sent successfully!");
        setShowCompose(false); // Close the compose modal
        setEmailData({ to: "", subject: "", body: "" }); // Clear the form

        // Refetch messages after sending
        await fetchMessages();
      } else {
        // Handle error
        alert(`Failed to send email: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="p-6 space-y-2">
          <div className="flex gap-x-2 items-center text-black">
            <Mail className="h-8 w-8" />
            <h1 className="text-2xl font-bold">বার্তা আদান প্রদান</h1>
          </div>
          <p className="text-sm text-gray-600 border-black border-b-[2px] pb-4">
            আপনার পাঠানো এবং প্রাপ্ত বার্তাগুলো এখানে পাবেন
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
            লিখুন
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors">
            <Inbox className="h-5 w-5" />
            ইনবক্স
          </button>
        </div>

        {/* Compose Email Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">ইমেইল লিখুন</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label
                    htmlFor="to"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ব্যক্তির ইমেইল:
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
                    বিষয়:
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
                    বার্তা:
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
                    বাদ দিন
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        পাঠান
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inbox Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ইনবক্স</h2>
          {inbox.length === 0 ? (
            <p className="text-gray-500">কোনো বার্তা নেই</p>
          ) : (
            <div className="space-y-4">
              {inbox.map((message, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold">{message.subject}</h3>
                  <p className="text-sm text-gray-600">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    প্রেরক: {message.from.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
