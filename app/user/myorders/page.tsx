"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./_components/data-tables";
import { columns } from "./_components/columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role-gate";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

import { Icons } from "@/components/icons";
const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/user/myorders");
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    })();
  }, []);

  // Update the specific order's status in the state
  const updateOrderStatus = (orderId: string) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: "DELIVERED" } : order
      )
    );
  };

  // Add the action for updating the status to the columns
  const tableColumns = React.useMemo(
    () =>
      columns.map((column) => {
        if (column.id === "deliver") {
          return {
            ...column,
            cell: ({ row }) => {
              const handleDeliver = async () => {
                try {
                  await axios.post(
                    `/api/user/myorders/${row.original.id}/delivered`
                  );
                  toast("Order status updated");
                  updateOrderStatus(row.original.id);
                } catch (error) {
                  console.error("Failed to update order status:", error);
                  toast("Failed to update order status");
                }
              };

              return (
                <Button
                  variant="small"
                  onClick={handleDeliver}
                  disabled={row.original.status === "DELIVERED"}
                >
                  
                  {row.original.status === "DELIVERED"?"Already delivered. ":<><CheckCircle className="mr-2 h-4 w-4" />Mark delivered</>} 
                </Button>
              );
            },
          };
        }
        return column;
      }),
    []
  );

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">All Orders</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length>0 ? (
          <DataTable columns={tableColumns} data={orders} />
        ) : (
          <div className="flex justify-center items-center">
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderPage;
