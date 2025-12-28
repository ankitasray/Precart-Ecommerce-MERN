"use client";

import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Header,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  type HeaderProps,
} from "@jamsr-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import { CiMenuKebab } from "react-icons/ci";

import DrawerUsage from "@/components/Drawer";
import Home from "@/components/Home";
import Men from "@/components/Men";
import Women from "@/components/Women";
import Cart from "@/components/Cart";
import Search from "@/components/Search";
import Sales from "@/components/Sales";
import Kids from "@/components/Kids";
import Menu1 from "@/components/Menu1";
import { CartIcon, Logo, SearchIcon } from "./svgs";

/* ================= TYPES ================= */
type User = {
  name: string;
  email: string;
  avatar?: string;
};

const popoverData = [
  { label: "Men", content: <Men /> },
  { label: "Women", content: <Women /> },
  { label: "Kids", content: <Kids /> },
  { label: "Accessories", content: <Home /> },
  { label: "Sales", content: <Sales /> },
];

const HeaderUsage = (props: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const avatarUrl = user?.avatar || "https://i.pravatar.cc/300";



  /* ================= FETCH LOGGED IN USER ================= */
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

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <>
      <Header className="flex justify-between" {...props}>
        <div className="container max-w-[1280px] mx-auto flex justify-between px-2 md:px-0 py-4 items-center">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo className="h-[22px] fill-black dark:fill-white" />
            </Link>
          </div>

          {/* NAV MENU */}
          <div className="hidden md:flex justify-center items-center w-full">
            {popoverData.map(({ label, content }, index) => (
              <Popover
                key={index}
                trigger={
                  <Button
                    variant="text"
                    disableRipple
                    disableAnimation
                    className={`text-md ui-hover:text-neutral-500 ${
                      isOpen === index ? "text-neutral-500" : ""
                    }`}
                  >
                    {label}
                  </Button>
                }
                triggerOn="hover"
                onOpenChange={(open) => setIsOpen(open ? index : null)}
                className="w-screen left-0 right-0 mx-auto p-0 shadow-none bg-transparent"
              >
                <div className="flex justify-center">
                  <div className="max-w-[1280px] w-full">{content}</div>
                </div>
              </Popover>
            ))}

            <Link
              href="https://github.com/mukesh7700/Precart"
              target="_blank"
            >
              <Chip variant="outlined" color="danger">
                <Chip variant="dot" color="danger">
                  Download
                </Chip>
              </Chip>
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            <IconButton label="Search" radius="full" onClick={() => setIsSearchOpen(true)}>
              <SearchIcon />
            </IconButton>

            <IconButton label="Search" radius="full" onClick={() => setIsCartOpen(true)}>
              <CartIcon />
            </IconButton>

            {/* USER MENU / LOGIN */}
            {user ? (
              <Menu
                classNames={{
                  popover: "min-w-[260px]",
                  content: "border-none p-0",
                }}
                trigger={
                  <IconButton label="Search" radius="full">
                    <Avatar
  alt={user.name}
  src={avatarUrl || undefined}
  name={user.name}
  className="bg-neutral-200 dark:bg-zinc-700 text-black dark:text-white"
>
  {!avatarUrl && firstLetter}
</Avatar>

                  </IconButton>
                }
                lockScroll={false}
              >
                <div className="p-2">
                  <MenuItem>
                    <Link href="/account">
                      <Card className="border-none bg-transparent p-1">
                        <CardHeader
                          heading={user.name}
                          subHeading={user.email}
                          className="p-0"
                          startContent={
                            <Avatar
  alt={user.name}
  src={avatarUrl || undefined}
  name={user.name}
  className="bg-neutral-200 dark:bg-zinc-700 text-black dark:text-white"
>
  {!avatarUrl && firstLetter}
</Avatar>

                          }
                        />
                      </Card>
                    </Link>
                  </MenuItem>
                </div>

                <Divider />

                <div className="p-2">
                  <Menu1 />
                </div>
              </Menu>
            ) : (
              <Link href="/login">
                <Button variant="outlined">Login</Button>
              </Link>
            )}

            <IconButton
            label="search"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <CiMenuKebab />
            </IconButton>
          </div>
        </div>
      </Header>

      {/* DRAWERS */}
      <DrawerUsage isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen}  onClose={() => setIsCartOpen(false)} />
      <Search isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </>
  );
};

export default HeaderUsage;
