"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { navigarionItems } from "@/config/navigation";

export default function Aside() {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  if (isLoginPage) return null;

  return (
    //
    <div
      className={`h-full fixed left-0 z-[150] w-[250px] border-r pt-6 pl-4 hidden sm:block bg-white`}
    >
      <div className="flex flex-col gap-2">
        {navigarionItems?.map((item) => {
          const { id, href, label, icon, children } = item;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          //부모와 자식 서로 같은 아이템이라 부모만 구조 분해
          return (
            <div key={id} className="relative">
              <Link href={href}>
                <button
                  className={`w-full flex h-10 gap-2 items-center rounded text-sm font-medium px-4  ${
                    isActive
                      ? "bg-black text-white hover:bg-black/80"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              </Link>
              {children && isActive && (
                <div className="flex flex-col gap-2 mt-2 ml-6 pl-2 border-l ">
                  {children?.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link href={child.href} key={child.id}>
                        <button
                          className={`w-full text-start text-sm h-8  hover:bg-gray-100 ${
                            isChildActive ? "font-medium" : "text-gray-500"
                          }`}
                        >
                          {child.label}
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
