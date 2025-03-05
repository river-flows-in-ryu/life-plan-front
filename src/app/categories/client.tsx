"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categoryData: Category[];
}

export default function Client({ categoryData }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="p-4 bg-[#f3f4f6]">
      <h1 className="font-bold text-2xl mb-5">{category} 카테고리</h1>
    </div>
  );
}
