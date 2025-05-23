"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const handleClickHamburgerButton = () => {};

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-white">
      <div className="h-full flex justify-between items-center  mx-auto px-4 sm:px-8">
        <div className="flex gap-1">
          <div className="block sm:hidden">
            <Menu onClick={handleClickHamburgerButton} />
          </div>
          <Link href="/">zzz</Link>
        </div>
        <button className="h-10 w-10 rounded-full bg-black"></button>
      </div>
    </header>
  );
}
