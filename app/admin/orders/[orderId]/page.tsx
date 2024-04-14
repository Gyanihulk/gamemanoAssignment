"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

import { toast } from "sonner";
import { Icons } from "@/components/icons";
enum OrderStatus {
  PENDING = "PENDING",
  INITIALIZED = "INITIALIZED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}
const OrderPage = ({ params }: { params: { orderId: string } }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = params;

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/admin/orders/${orderId}`);
        setSelectedStatus(response.data.status);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch order status:", error);
        setError(error as any); 
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setSelectedStatus(newStatus);

    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}`, {
        status: newStatus,
      });
      toast.success("Order Status Updated");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Card className="w-[300px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            Update Order Status
          </p>
        </CardHeader>
        <CardContent className="flex space-y-4 justify-center">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order Status</SelectLabel>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </RoleGate>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
