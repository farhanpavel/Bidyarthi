"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  AppWindowIcon,
  LogOut,
  Salad,
  Bus,
  School,
  Anvil,
  Captions,
  Cable,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import Image from "next/image";
import { useEffect, useState } from "react"; // Import useEffect and useState
import Cookies from "js-cookie";

const navItems = [
  // {
  //   title: "সংক্ষিপ্ত বিবরণ",
  //   href: "/driverdashboard/overview",
  //   icon: <Home size={20} />,
  // },
  {
    title: "প্রবেশ",
    href: "/driverdashboard/bus",
    icon: <AppWindowIcon size={20} />,
  },
];

export default function BusSidebar() {
  const pathname = usePathname();
  const [tripPlanId, setTripPlanId] = useState("");
  const handleClick = () => {
    Cookies.remove("token");
    Cookies.remove("role");
  };
  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const tripPlanId = queryParams.get("tripPlanId") || "";
    setTripPlanId(tripPlanId);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 left-0 h-screen w-64 border-r bg-background pt-16 flex flex-col">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-center border-b px-2">
            <Image
              src="/images/logo.png"
              alt="Dashboard Logo"
              width={100}
              height={100}
              className="text-lg font-semibold tracking-tight -mt-4"
            />
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-2 py-4">
              {navItems.map((item, index) => {
                const href = item.disabled
                  ? "/"
                  : `${item.href}${
                      tripPlanId ? `?tripPlanId=${tripPlanId}` : ""
                    }`;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link key={index} href={href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start mb-2",
                        item.disabled && "pointer-events-none opacity-60"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
          <div className="mt-auto border-t p-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleClick}
              >
                <LogOut size={20} className="mr-2" />
                লগআউট করুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
