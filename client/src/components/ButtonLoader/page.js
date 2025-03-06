"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ButtonLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Delay of 0.3 seconds before the animation starts

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-square-check-big"
  >
    <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5" />
    <path d="m9 11 3 3L22 4" />
  </svg>;
  return (
    <div className="top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-6"
      >
        <motion.path
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          pathLength="1"
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: isVisible ? 0 : 1 }}
          transition={{ duration: 3, delay: 0.3 }} // Animation duration and delay
          style={{
            fill: "transparent",
            stroke: "white",
            strokeWidth: "2px",
            strokeDasharray: "1",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </svg>
    </div>
  );
}
