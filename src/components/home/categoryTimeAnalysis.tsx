import React from "react";

import Link from "next/link";

import { ChartPie, Calendar, ArrowRight } from "lucide-react";

interface Props {
  categoryTime: {
    data: { category__name: string; total_time: number }[];
    total_minutes: number;
  };
}

export default function CategoryTimeAnalysis({ categoryTime }: Props) {
  const { data, total_minutes } = categoryTime;
  return (
    <div className="border p-6 mt-6 rounded-lg">
      <div className="flex gap-2 mb-6 items-center">
        <ChartPie width={16} height={16} />
        <span className="font-semibold">시간 분석</span>
      </div>
      {data && data.length > 0 ? (
        data.map((categoryData, index) => {
          const { category__name, total_time } = categoryData;
          const hour = Math.floor(total_time / 60);
          const minutes = Math.floor(total_time % 60);

          return (
            <div
              key={index}
              className={`flex justify-between items-center ${
                index === 0 ? "" : "mt-3"
              }`}
            >
              <p className="text-sm truncate font-medium">{category__name}</p>
              <div className="flex flex-col text-right">
                <p className="text-sm font-medium">
                  {hour === 0
                    ? `${minutes} m`
                    : minutes === 0
                    ? `${hour} h`
                    : `${hour} h ${minutes} m`}
                </p>
                <span className="text-xs text-muted-foreground">
                  {Math.round((total_time / total_minutes) * 100)}%
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4">
          <div className="flex flex-col justify-center">
            <div className="w-14 h-14 p-3 bg-gray-100 rounded-full mx-auto mb-3">
              <Calendar width={32} height={32} />
            </div>
            <p className="text-gray-700 font-medium mb-1">
              오늘 일정이 없습니다.
            </p>
            <span className="ext-sm text-gray-500 ">
              일정을 추가하면 카테고리 별 시간이 추가됩니다.
            </span>
          </div>
        </div>
      )}
      <Link href="/schedule-report">
        <button className="w-full h-10 border rounded flex justify-center items-center gap-2 mt-4 text-sm font-medium ">
          상세 리포트 보기
          <ArrowRight width={16} height={16} />
        </button>
      </Link>
    </div>
  );
}
