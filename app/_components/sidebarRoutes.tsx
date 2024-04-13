"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import { SideBarItem } from "./sidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
  { icon: Layout, label: "Movies DVD ", href: "/shop" },
  { icon: List, label: "My orders", href: "/user/myorders" },
];

const adminRoutes = [
  { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
  { icon: List, label: "Orders", href: "/admin/orders" },
];
export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes("/admin");
  const routes = isAdminPage ? adminRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SideBarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
