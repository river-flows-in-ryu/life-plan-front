"use client";

import React from "react";

import { usePathname } from "next/navigation";

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <main className={`pl-0  mx-auto ${isLoginPage ? "" : "sm:pl-[250px]"}`}>
      {children}
    </main>
  );
}
