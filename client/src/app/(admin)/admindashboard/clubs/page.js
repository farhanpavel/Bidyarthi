"use client";
import { CalendarCheck, LayoutDashboard, Trophy } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel, // Add this for pagination
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
import { columns } from "./_datatable/action"; // Ensure this import is correct
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Add Button component for pagination controls
import { url } from "@/components/Url/page";

export default function Page() {
  const [dataAll, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/club`, {
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

  const table = useReactTable({
    data: dataAll,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    initialState: {
      pagination: {
        pageSize: 5, // Set the default page size
      },
    },
  });

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Trophy className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">ক্লাব ব্যবস্থাপনা প্যানেল</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4 font-bangla">
        আমাদের এক্সক্লুসিভ কমিউনিটিতে যোগ দিন
        </p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <Input
                placeholder="নামের মাধ্যমে অনুসন্ধান"
                value={table.getColumn("name")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-[20rem] text-xs font-bangla"
              />
            </div>
            <div className="flex items-center">
              <Link
                className="bg-black  py-2 px-4 rounded-[5px] text-white text-xs transition-all delay-200 font-bangla"
                href="/admindashboard/clubs/new"
              >
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
