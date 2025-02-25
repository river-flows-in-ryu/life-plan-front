import React from "react";

import { Progress } from "@/components/ui/progress";

import { CategoryData } from "@/types/plan";

interface Props {
  total_minutes: number;
  data: CategoryData[];
}

export default function CategoryUsageAnalysisChart({
  data,
}: {
  data: Props | null;
}) {
  const totalHours = data?.total_minutes ?? 0;

  const categories = data?.data?.map((item) => ({
    name: item?.category__name,
    value: item.total_time,
  }));
  return (
    <div>
      {categories?.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-sm text-gray-500">
              {category.value}분 (
              {((category.value / totalHours) * 100).toFixed(1)}%)
            </span>
          </div>
          <Progress value={(category.value / totalHours) * 100} />
        </div>
      ))}
    </div>
  );
}
