"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function Client() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const urlPeriod = searchParams.get("period") || "week";

  const [category, setCategory] = useState<string | null>(
    categoryParam ? decodeURIComponent(categoryParam) : null
  );

  const [periodType, setPeriodType] = useState(urlPeriod);

  const router = useRouter();

  useEffect(() => {
    const period = searchParams.get("period");
    if (period === "week" || period === "month" || period === "custom") {
      setPeriodType(period);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const res = await fetch(``);
      } catch (error) {
        console.error(error);
      }
    };
    // handleFetchData();
  }, []);

  const handlePeriodChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", type);
    router.push(`/categories/change?${params.toString()}`);
  };

  const HeaderSection = () => {
    return (
      <div className="sm:flex sm:justify-between mb-0 sm:mb-6 ">
        <div className="h-10 p-1 sm:w-[400px] w-full flex bg-[#f3f4f6] sm:mb-0 mb-6">
          {["week", "month", "custom"].map((type) => (
            <button
              key={type}
              className={`w-1/3 ${
                periodType === type ? "bg-white font-bold" : ""
              }`}
              onClick={() => handlePeriodChange(type)}
            >
              {type === "week" && "주간"}
              {type === "month" && "월간"}
              {type === "custom" && "사용자지정"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{category} 카테고리 변경</h1>
          <span>
            총 {}개 활동, {}시간 {}분
          </span>
        </div>
        <HeaderSection />
      </div>
    </div>
  );
}
