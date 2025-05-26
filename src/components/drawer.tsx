"use client";

import React, { useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { X } from "lucide-react";

import { navigarionItems } from "@/config/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const pathname = usePathname();

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] sm:hidden ">
      <div
        className="w-full h-full absolute bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="bg-white absolute left-0 top-0 h-full w-3/4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between border-b">
            <Link href="/">
              <h3 className="font-medium text-xl">zzz</h3>
            </Link>
            <X onClick={onClose} />
          </div>
          <div className="flex flex-col gap-2">
            {navigarionItems?.map((item) => {
              const { id, href, label, icon, children } = item;
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);
              const isNotChild = !children || children?.length === 0;

              //부모와 자식 서로 같은 아이템이라 부모만 구조 분해
              return (
                <div key={id} className="relative">
                  {isNotChild ? (
                    <Link href={href} onClick={onClose}>
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
                  ) : (
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
                  )}

                  {children && isActive && (
                    <div className="flex flex-col gap-2 mt-2 ml-6 pl-2 border-l ">
                      {children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            href={child.href}
                            key={child.id}
                            onClick={onClose}
                          >
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
      </div>
    </div>
  );
}
