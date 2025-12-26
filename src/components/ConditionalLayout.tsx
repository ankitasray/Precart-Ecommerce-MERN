"use client";

import { usePathname } from "next/navigation";
import LayoutContent from "@/components/LayoutContent";
import React from "react";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <LayoutContent>{children}</LayoutContent>;
}
