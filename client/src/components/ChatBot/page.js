"use client";

import React, { useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chatbot Button */}
      <button
        onClick={toggleChatbot}
        className="bg-purple-700 text-white p-4 rounded-full shadow-lg hover:bg-purple-500 transition-all"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          {/* Chat Header */}
          <div className="bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">AI Chatbot</h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <p className="bg-gray-100 p-2 rounded-lg">
                Hello! How can I help you today?
              </p>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
