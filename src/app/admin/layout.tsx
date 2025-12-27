"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/admin/check", {
        withCredentials: true,
      })
      .then(() => {
        setIsAdmin(true);
        setLoading(false);
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  }, [pathname]);

  /* ⏳ Loading state */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        Checking access...
      </div>
    );
  }

  /* 🚫 Restricted page */
  if (!isAdmin && !isLoginPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Restricted Access</h1>
        <p className="text-neutral-400 max-w-md">
          You do not have permission to access this page.
          Please contact the administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  /* ✅ Admin allowed */
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {!isLoginPage && <AdminSidebar />}
      <main className="flex-1 p-6 bg-neutral-900">
        {children}
      </main>
    </div>
  );
}
