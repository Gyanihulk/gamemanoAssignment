"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { Order } from "@/types";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/router";
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const address = row.original.address;

      return (
        <div className="ml-4">
          {address.street} {address.city}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("total") || "0");
      const formatted = formatPrice(price);

      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("status") || false;
      return (
        <Badge className={cn("ml-4 bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished as string}
        </Badge>
      );
    },
  },
  {
    id: "deliver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Accepted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      
      return (
        <Button
          variant="ghost"
          disabled={row.original.status === "DELIVERED"} 
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Accepted
        </Button>
      );
    },
  },
];
