import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./data";

export const columns = [
  {
    accessorKey: "routeName",

    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        রাউটের নাম
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "busNum",

    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        বাসের নাম
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "schedule",

    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        শিডিউল
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "startPoint",

    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        প্রস্থান স্থান
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "endPoint",

    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        গন্তব্য
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
