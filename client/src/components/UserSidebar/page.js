"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  LogOut,
  Salad,
  BusIcon,
  BookOpen,
  Building2,
  Bell,
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
import {useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useNotificationModalStore} from "@/components/Notification/store";
import {MessageContext} from "@/utils/context/MessageContext";

const navItems = [
  {
    title: "খাবার",
    href: "/userdashboard/meal",
    icon: <Salad size={20} />,
  },
  {
    title: "বাস",
    href: "/userdashboard/bus",
    icon: <BusIcon size={20} />,
  },
  {
    title: "ক্লাব",
    href: "/userdashboard/club",
    icon: <Building2 size={20} />,
  },
  {
    title: "ফ্যাকালটি",
    href: "/userdashboard/faculty",
    icon: <BookOpen size={20} />,
  },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const [tripPlanId, setTripPlanId] = useState("");
  const { openNotificationModal } = useNotificationModalStore();
  const [readStatus, setReadStatus] = useState(false);

  const {message} = useContext(MessageContext);

  const handleClick = () => {
    Cookies.remove("token");
    Cookies.remove("role");
  };

  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const tripPlanId = queryParams.get("tripPlanId") || "";
    setTripPlanId(tripPlanId);
    const read = Cookies.get("readStatus");
    console.log("read", read);
    if(read!==undefined){
        setReadStatus(read);
    }
  }, []);

  useEffect(() => {
    if(!message) return;
    if(!message.data) return;
    if(!message.data.topic) return;
    if (message.data.topic === "announcement")
    setReadStatus(false);
    if (message.data.topic === "emergency")
    setReadStatus(false);
  }, [message]);

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
                      tripPlanId ? `&tripPlanId=${tripPlanId}` : ""
                    }`;
                // Check if the current path matches the item's href, ignoring query parameters
                const isActive = pathname.startsWith(item.href.split("?")[0]);

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
            <Link href="/userdashboard/notification?dialog=true">
              <Button variant="ghost" className="w-full justify-start">
                <Bell size={20} className="mr-2" />
                নোটিফিকেশন
              </Button>
            </Link>

              <Button variant="ghost" className="w-full justify-start"
                        onClick={()=>{
                            openNotificationModal();
                            setReadStatus(true);
                            Cookies.set("readStatus", readStatus);
                        }}
              >
                <Bell size={20} className="mr-2" />
                নোটিফিকেশন
                <div className="flex-1"/>
                {!readStatus && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </Button>
            {/*<Link href="/userdashboard/notification?dialog=true">*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <Bell size={20} className="mr-2" />*/}
            {/*    নোটিফিকেশন*/}
            {/*  </Button>*/}
            {/*</Link>*/}
          </div>
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
