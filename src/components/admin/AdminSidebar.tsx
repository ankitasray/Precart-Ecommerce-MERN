"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) =>
    pathname === path
      ? "bg-primary text-white"
      : "text-neutral-400 hover:bg-neutral-800";

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.replace("/admin/login");
    }
  };

  return (
    <aside className="w-64 border-r border-neutral-800 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <Link
          href="/admin"
          className={`block px-4 py-2 rounded ${isActive("/admin")}`}
        >
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`block px-4 py-2 rounded ${isActive("/admin/products")}`}
        >
          Products
        </Link>

        <Link
          href="/admin/categories"
          className={`block px-4 py-2 rounded ${isActive("/admin/categories")}`}
        >
          Categories
        </Link>

        <Link
          href="/admin/orders"
          className={`block px-4 py-2 rounded ${isActive("/admin/orders")}`}
        >
          Orders
        </Link>
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`mt-6 flex items-center gap-3 px-4 py-2 rounded transition-colors cursor-pointer ${
          theme === "light"
            ? "text-neutral-500 hover:bg-neutral-100"
            : "text-neutral-300 hover:bg-neutral-800"
        }`}
      >
        <span className="h-5 w-5 flex items-center justify-center ">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </span>
        <span>Change Theme</span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-4 w-full text-left px-4 py-2 text-red-400 hover:bg-neutral-800 rounded cursor-pointer"
      >
        Logout
      </button>
    </aside>
  );
}
