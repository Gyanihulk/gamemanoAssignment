"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { DataTable } from "./_components/data-tables";
import { columns } from "./_components/columns";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/admin/orders');
        if (response.status === 200) {
          setOrders(response.data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    })();
  }, []);

  
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">All Orders</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
        <DataTable columns={columns} data={orders} />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
