"use client";

import {
  Divider,
  Sidebar,
  SidebarMenuItemButton,
} from "@jamsr-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import data from "@/data/Menu";
import React, { useState } from "react";
import { Logout } from "./svgs";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";

export const SidebarUsage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      router.replace("/login"); // prevent back navigation
    } catch (err) {
      console.error("Logout failed", err);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Sidebar className="w-[300px] h-auto bg-transparent">
      <>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <div className="py-1">
              {item.items.map((subItem, subIndex) => {
                const isActive = pathname === subItem.url;
                return (
                  <Link href={subItem.url} key={subIndex}>
                    <SidebarMenuItemButton
                      className={`mt-3 flex gap-3 text-lg ${
                        isActive
                          ? theme === "light"
                            ? "bg-neutral-100"
                            : "bg-zinc-800"
                          : ""
                      }`}
                    >
                      <span className="w-6 h-6">{subItem.icon}</span>
                      <span>{subItem.title}</span>
                    </SidebarMenuItemButton>
                  </Link>
                );
              })}

              {/* LOGOUT BUTTON */}
              <SidebarMenuItemButton
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-3 flex gap-3 text-lg ui-hover:bg-danger"
              >
                <span className="w-6 h-6">
                  <Logout />
                </span>
                <span>
                  {loggingOut ? "Logging out..." : "Logout"}
                </span>
              </SidebarMenuItemButton>
            </div>

            {index !== data.length - 1 && (
              <Divider className="mx-2" />
            )}
          </React.Fragment>
        ))}
      </>
    </Sidebar>
  );
};
