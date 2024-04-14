"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsPage = () => {
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
        <p className="text-2xl font-semibold text-center">Analytics Dashboard</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
            Hello
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPage;
