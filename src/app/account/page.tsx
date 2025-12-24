"use client";

import Card4 from "@/components/BorderCard4";
import {
  Account,
  Email,
  Gift,
  Location,
  Return,
  ShopingBeg,
  Wallet,
} from "@/components/svgs";
import { Avatar, Card, CardHeader } from "@jamsr-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MdNavigateNext } from "react-icons/md";

type User = {
  email: string;
  role: string;
};

const AvatarItem = () => (
  <Avatar
    alt="user"
    src="https://i.pravatar.cc/300"
    width={100}
    height={100}
  />
);

const account = [
  {
    logo: <Account />,
    title: "Account",
    subtitle: "Update your details, email preferences and password",
    linkHref: "/personal-info",
  },
  {
    logo: <ShopingBeg />,
    title: "My Orders",
    subtitle: "Check order status or past orders",
    linkHref: "/my-order",
  },
  {
    logo: <Location />,
    title: "Addresses",
    subtitle: "Manage billing & shipping addresses",
    linkHref: "/addresses",
  },
  {
    logo: <Wallet />,
    title: "Payment",
    subtitle: "Manage credit cards",
    linkHref: "/payment",
  },
  {
    logo: <Email />,
    title: "Email Newsletter",
    subtitle: "Email preferences",
    linkHref: "/email-newsletter",
  },
  {
    logo: <Gift />,
    title: "Gift Cards",
    subtitle: "Redeem or purchase gift cards",
    linkHref: "/gift-card",
  },
  {
    logo: <Return />,
    title: "Returns & Refunds",
    subtitle: "Manage returns",
    linkHref: "/return-and-refund",
  },
];

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );
        setUser(res.data);
      } catch {
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // 🔹 Logout
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    router.push("/login");
  };

  if (!user) return null;

  return (
    <section className="container max-w-[1280px] mx-auto">
      <div className="py-10">
        <p className="text-2xl font-semibold">Account</p>

        <div className="flex justify-between items-center">
          <Card className="px-0 pb-4 border-none bg-transparent">
            <CardHeader
              heading={user.email.split("@")[0]}
              startContent={<AvatarItem />}
              subHeading={user.email}
            />
          </Card>

          <button
            onClick={handleLogout}
            className="text-lg font-semibold underline underline-offset-8 hover:text-violet-400"
          >
            Logout
          </button>
        </div>

        <div className="py-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {account.map((item, index) => (
            <Card4 key={index} {...item} />
          ))}
        </div>

        <div className="py-10 flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Need assistance?</p>
            <p className="text-md text-neutral-500">
              Ask our customer service <br />
              Mon to Sun, 5 am to 8 pm PT
            </p>
          </div>

          <Link
            href="/help"
            className="hover:text-violet-500 underline underline-offset-4 flex items-center text-md font-semibold"
          >
            Contact us <MdNavigateNext />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
