"use client";

import { Divider, MenuItem } from "@jamsr-ui/react";
import Link from "next/link";
import data from "@/data/Menu";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { LogInIcon, Moon, Sun } from "./svgs";
import axios from "axios";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type User = {
  name: string;
  email: string;
  avatar?: string;
};

const Menu1 = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  /* ================= CHECK LOGIN ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  };

  /* ================= AVATAR URL ================= */
  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}?t=${Date.now()}`
    : null;

  return (
    <>
      {/* ================= MAIN MENU ================= */}
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div>
            {item.items.map((subItem, subIndex) => (
              <Link href={subItem.url} key={subIndex}>
                <MenuItem
                  className={`py-3 text-md ${
                    theme === "light"
                      ? "text-neutral-500"
                      : "text-neutral-300"
                  }`}
                  startContent={
                    <div
                      className={`h-5 w-5 ${
                        theme === "light"
                          ? "text-neutral-500"
                          : "text-neutral-300"
                      }`}
                    >
                      {subItem.icon}
                    </div>
                  }
                >
                  <span>{subItem.title}</span>
                </MenuItem>
              </Link>
            ))}
          </div>
          {index !== data.length - 1 && <Divider className="mx-2" />}
        </React.Fragment>
      ))}

      {/* ================= THEME TOGGLE ================= */}
      <MenuItem
        onClick={toggleTheme}
        className={`py-3 text-md ${
          theme === "light" ? "text-neutral-500" : "text-neutral-300"
        }`}
        startContent={
          <div
            className={`h-5 w-5 ${
              theme === "light"
                ? "text-neutral-500"
                : "text-neutral-300"
            }`}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </div>
        }
      >
        <span>Change Appearance</span>
      </MenuItem>

      <Divider className="mx-2" />

      {/* ================= USER / AUTH ================= */}
      {user ? (
        <>
          {/* PROFILE ITEM WITH AVATAR */}
          

          {/* LOGOUT */}
          <MenuItem
            onClick={handleLogout}
            className="py-3 text-md text-red-600 ui-hover:bg-danger/10"
            startContent={
              <div className="h-5 w-5 text-red-600">
                <LogInIcon />
              </div>
            }
          >
            <span>Logout</span>
          </MenuItem>
        </>
      ) : (
        <Link href="/login">
          <MenuItem
            className={`py-3 text-md ${
              theme === "light"
                ? "text-neutral-500"
                : "text-neutral-300"
            }`}
            startContent={
              <div
                className={`h-5 w-5 ${
                  theme === "light"
                    ? "text-neutral-500"
                    : "text-neutral-300"
                }`}
              >
                <LogInIcon />
              </div>
            }
          >
            <span>Log In</span>
          </MenuItem>
        </Link>
      )}
    </>
  );
};

export default Menu1;
