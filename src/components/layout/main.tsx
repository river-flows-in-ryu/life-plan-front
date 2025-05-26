"use client";

import React from "react";

import { usePathname } from "next/navigation";

export default function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <main
      className={`pl-0  mx-auto mb-[65px] sm:mb-0  
      ${isLoginPage ? "" : "sm:pl-[250px]"}`}
    >
      <div className="w-[356px] sm:min-w-[1024px]">{children}</div>
    </main>
  );
}
