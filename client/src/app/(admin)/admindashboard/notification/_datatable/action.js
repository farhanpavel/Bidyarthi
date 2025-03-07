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
    accessorKey: "message",
    header: ({ column }) => (
      <button
        className="hover:bg-pink-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        বার্তা
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <button
        className="hover:bg-pink-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        স্থান <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),

    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <button
        className="hover:bg-pink-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ধরন <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),

    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="hover:bg-pink-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100 font-bangla"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        পাবলিশের সময় <ArrowUpDown className="ml-2 h-4 w-4" />
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
