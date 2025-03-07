"use client";

import React, { useState } from "react";
import { Bot, MessageCircle, X, Loader2 } from "lucide-react"; // Import Loader2 for the spinner
import { url } from "../Url/page";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]); // Initial bot message
  const [inputText, setInputText] = useState(""); // User's input
  const [loading, setLoading] = useState(false); // Loading state

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return; // Ignore empty messages

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, sender: "user" },
    ]);
    setInputText(""); // Clear input field
    setLoading(true); // Start loading

    try {
      // Send user's message to the backend
      const response = await fetch(`${url}/api/bot/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await response.json();

      // Add AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Failed to get a response. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="bg-black text-white p-4 rounded-full shadow-lg transition-all"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="bg-black text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">AI Chatbot</h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <p
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-purple-500"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={loading} // Disable input while loading
              />
              <button
                onClick={handleSendMessage}
                className="bg-black text-white p-2 rounded-lg transition-all flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" /> // Show spinner while loading
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
