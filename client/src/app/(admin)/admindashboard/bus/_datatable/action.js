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
// import { useAppContext } from "@/components/Context/admincontext";
// import { DeleteDialog } from "@/components/Delete/page";
// import { url } from "@/components/Url/page";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./data";

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        নাম
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "bus_url",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        বাস ইউআরএল বাস ইউআরএল
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "bus_no",
    accessorKey: "bus_no",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        বাস নম্বর বাস নম্বর
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "source",
    accessorKey: "source",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        প্রস্থান স্থান প্রস্থান স্থান
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "destination",
    accessorKey: "destination",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        গন্তব্য গন্তব্য
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
