"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { mobileNavigarionItems } from "@/config/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login") return null;
  return (
    <footer className="w-full fixed bottom-0 left-0 z-50 block sm:hidden border-t bg-white">
      <div className="grid grid-cols-5 h-16">
        {mobileNavigarionItems?.map((item) => {
          const { id, href, label, icon, primary, active } = item;

          const isActive = href === pathname;
          return (
            <div
              className="w-full h-full flex justify-center items-center"
              key={id}
            >
              <Link href={href}>
                {primary ? (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black -mt-10">
                    {icon}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center">
                      {icon}
                    </div>
                    <span
                      className={`text-xs ${
                        isActive ? "text-black font-bold" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
