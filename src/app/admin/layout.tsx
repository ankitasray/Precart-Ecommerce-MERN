"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {!isLoginPage && <AdminSidebar />}

      <main className="flex-1 p-6 bg-neutral-900">
        {children}
      </main>
    </div>
  );
}
