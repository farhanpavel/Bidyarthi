"use client";
import {
  BellIcon,
  ShieldAlert,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { url } from "@/components/Url/page";

export default function Page() {
  const [dataAll, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/emergency`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        setData(json);
      }
    };
    fetchData();
  }, []);

  // Function to get columns dynamically
  const getColumns = (data) => {
    const hasAnnouncement = data.some((item) => item.type === "ANNOUNCEMENT");

    const baseColumns = [
      {
        accessorKey: "message",
        header: "Message",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "createdAt",
        header: "Publish Time",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return date.toLocaleString(); // Format the date
        },
      },
    ];

    if (!hasAnnouncement) {
      baseColumns.splice(2, 0, {
        accessorKey: "emergencyLevel",
        header: "Emergency Level",
        cell: ({ row }) => {
          const level = row.getValue("emergencyLevel");
          let color = "";
          switch (level) {
            case "HIGH":
              color = "bg-red-500";
              break;
            case "MEDIUM":
              color = "bg-yellow-500";
              break;
            case "LOW":
              color = "bg-green-500";
              break;
            default:
              color = "bg-gray-500";
          }
          return (
              <div className={`${color} text-white px-2 py-1 rounded-full text-center`}>
                {level}
              </div>
          );
        },
      });
    }

    return baseColumns;
  };

  const columns = getColumns(dataAll);

  const table = useReactTable({
    data: dataAll,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
      <div>
        <div className="p-9 space-y-2">
          <div className="flex gap-x-2 items-center text-black">
            <BellIcon className="text-3xl" />
            <h1 className="text-2xl font-bold font-bangla">নোটিফিকেশন প্যানেল</h1>
          </div>
          <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4 font-bangla">
            আপনার জরুরি আপডেট এবং নোটিফিকেশনগুলি প্রদান করুন।
          </p>

          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <Input
                    placeholder="নামের মাধ্যমে অনুসন্ধান"
                    value={table.getColumn("message")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("message")?.setFilterValue(event.target.value)
                    }
                    className="max-w-[20rem] text-xs font-bangla"
                />
              </div>
              <div className="flex items-center">
                <Link
                    className="flex items-center gap-x-1 bg-gradient-to-r from-red-500 to-red-700 py-2 px-4 rounded-[5px] text-white text-xs transition-all delay-200 font-bangla"
                    href="/admindashboard/notification/new"
                >
                  <ShieldAlert className="w-4 h-4" />
                  তৈরি করুন
                </Link>
              </div>
            </div>

            <div className="rounded-md border">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                            </TableHead>
                        ))}
                      </TableRow>
                  ))}
                </TableHeader>

                <TableBody className="text-left">
                  {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                          <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                  )}
                                </TableCell>
                            ))}
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-[310px] text-center text-muted-foreground border border-gray-300 font-bangla"
                        >
                          ফলাফল পাওয়া যায়নি
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                  পূর্ববর্তী
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                  পরবর্তী
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center mt-1">
                <span className="text-sm font-bangla">
                  পৃষ্ঠা {table.getState().pagination.pageIndex + 1} এর{" "}
                  {table.getPageCount()}
                </span>
                </div>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="border rounded p-1 text-sm"
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize} প্রতি পৃষ্ঠায়
                      </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}