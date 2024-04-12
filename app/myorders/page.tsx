
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from "./_components/data-tables";
import { columns } from "./_components/columns";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/user/myorders');
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
    <div className="p-6">
      <DataTable columns={columns} data={orders} />
    </div>
  );
};

export default OrderPage;
