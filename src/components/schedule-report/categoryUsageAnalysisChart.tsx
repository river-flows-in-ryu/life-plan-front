import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Progress } from "@/components/ui/progress";

import { CategoryData } from "@/types/plan";

import { DateRange } from "react-day-picker";

import rightArrow from "../../../public/right_arrow.png";
import progress from "../../../public/progress.png";

interface Props {
  total_minutes: number;
  data: CategoryData[];
}

export default function CategoryUsageAnalysisChart({
  data,
  periodType,
  date,
}: {
  data: Props | null;
  periodType: string;
  date: DateRange | undefined;
}) {
  const router = useRouter();

  const totalHours = data?.total_minutes ?? 0;

  const categories = data?.data?.map((item) => ({
    name: item?.category__name,
    value: item.total_time,
  }));

  const backgroundColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(55, 99, 132, 1)",
    "rgba(47, 162, 235, 1)",
    "rgba(25, 26, 86, 1)",
    "rgba(7, 192, 12, 1)",
    "rgba(15, 12, 255, 1)",
    "rgba(25, 19, 64, 1)",
    "rgba(200, 20, 164, 1)",
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (periodType === "custom") {
      if (!date?.from || !date?.to) {
        alert("시작일과 종료일 모두 선택해주세요");
        return;
      }
      const startDate = format(date.from, "yyyy-MM-dd");
      const endDate = format(date.to, "yyyy-MM-dd");

      router.push(
        `/categories?category=${categoryName}&period=custom&start_date=${startDate}&end_date=${endDate}`
      );
    } else {
      router.push(`/categories?category=${categoryName}&period=${periodType}`);
    }
  };

  return (
    <div className="flex flex-col ">
      {categories && categories.length > 0 ? (
        <>
          {categories?.map((category, index) => (
            <div
              key={category.name}
              className="space-y-2 py-2 px-3 border border-transparent hover:border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleCategoryClick(category?.name)}
            >
              <div className="flex justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: backgroundColor[index] }}
                >
                  {category.name}
                </span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {category.value}분 (
                    {((category.value / totalHours) * 100).toFixed(1)}%)
                  </span>
                  <Image
                    src={rightArrow}
                    alt="flaction_arrow_img"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <Progress
                value={(category.value / totalHours) * 100}
                indicatorColor={backgroundColor[index]}
              />
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center pt-10 pb-0 sm:pb-10 gap-3 ">
          <div className="w-[56px] h-[56px] bg-gray-100 rounded-full flex justify-center items-center">
            <Image
              src={progress}
              alt="flaction_donut_img"
              width={32}
              height={32}
            />
          </div>
          <span>데이터가 없습니다.</span>
        </div>
      )}
    </div>
  );
}
