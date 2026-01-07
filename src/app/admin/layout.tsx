"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useTheme } from "@/context/ThemeContext";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const { theme } = useTheme(); // ✅ get theme
  const isDark = theme === "dark";

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
  }, [pathname, isLoginPage]);

  /* ⏳ Loading state */
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-neutral-950 text-white" : "bg-gray-100 text-black"
        }`}
      >
        Checking access...
      </div>
    );
  }

  /* 🚫 Restricted page */
  if (!isAdmin && !isLoginPage) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center px-4 ${
          isDark ? "bg-neutral-950 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">
          Restricted Access
        </h1>
        <p className="text-neutral-500 max-w-md">
          You do not have permission to access this page.
          Please contact the administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  /* ✅ Admin allowed */
  return (
    <div
      className={`flex min-h-screen ${
        isDark ? "bg-neutral-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {!isLoginPage && <AdminSidebar />}

      <main
        className={`flex-1 p-6 ${
          isDark ? "bg-neutral-900" : "bg-white"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
