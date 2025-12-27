"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) =>
    pathname === path
      ? "bg-primary text-white"
      : "text-neutral-400 hover:bg-neutral-800";

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 border-r border-neutral-800 p-4">
      <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <Link href="/admin" className={`block px-4 py-2 rounded ${isActive("/admin")}`}>
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`block px-4 py-2 rounded ${isActive("/admin/products")}`}
        >
          Products
        </Link>

        <Link
          href="/admin/orders"
          className={`block px-4 py-2 rounded ${isActive("/admin/orders")}`}
        >
          Orders
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 w-full text-left px-4 py-2 text-red-400 hover:bg-neutral-800 rounded"
      >
        Logout
      </button>
    </aside>
  );
}
