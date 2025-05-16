import React from "react";

import { Progress } from "@/components/ui/progress";

interface Goals {
  category: number;
  created_at: string;
  end_date: string;
  goal_type: string;
  id: number;
  is_copleted: boolean;
  period_type: "daily" | "weekly" | "monthly";
  start_date: string;
  target: number;
  title: string;
  current: number;
}
interface Props {
  data: Goals[];
}

export default function GoalCard({ data }: Props) {
  const getProgressColor = (percentage: number): string => {
    if (percentage < 20) {
      return "rgba(220, 38, 38, 1)"; // 빨강 - red-600
    } else if (percentage < 40) {
      return "rgba(234, 88, 12, 1)"; // 주황 - orange-600
    } else if (percentage < 60) {
      return "rgba(250, 204, 21, 1)"; // 밝은 노랑 - yellow-400
    } else if (percentage < 80) {
      return "rgba(132, 204, 22, 1)"; // 연초록 - lime-400
    } else if (percentage < 100) {
      return "rgba(74, 222, 128, 1)"; // 100% 밝은 초록 - green-400
    } else {
      return "rgba(34, 197, 94, 1)"; // 더 밝은 초록 - green-500
    }
  };

  const PERIOD_MAP = {
    daily: "일일",
    weekly: "주간",
    monthly: "월간",
  };
  return (
    <>
      {data?.map((item) => {
        const {
          start_date,
          end_date,
          goal_type,
          period_type,
          target,
          title,
          id,
          current,
        } = item;

        const progressPercent =
          target > 0 ? Math.min(Math.floor((current / target) * 100), 100) : 0;

        return (
          <div
            className="rounded-lg"
            key={id}
            style={{ border: `1px solid ${getProgressColor(progressPercent)}` }}
          >
            <div
              className="p-4 rounded-t"
              style={{ backgroundColor: getProgressColor(progressPercent) }}
            >
              <></>
              <div>
                <h3 className="font-medium text-lg text-white">{title}</h3>
                <div className="flex gap-2 mt-1 text-white">
                  <div className="px-2.5 py-0.5 rounded-full text-xs bg-[#ffffff80] text-black">
                    {PERIOD_MAP[period_type]}
                  </div>
                  <span className="text-xs">
                    {start_date} ~ {end_date}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 mb-4">
              <div className="flex justify-between mb-3 text-sm font-medium">
                <span className="font-medium">
                  목표 : {target}
                  {goal_type === "count" ? "회" : "시간"}
                </span>
                <span className="font-medium">현재 : todo</span>
              </div>
              <span
                className="text-xs"
                style={{ color: getProgressColor(progressPercent) }}
              >
                진행률 : {progressPercent} %
              </span>
              <Progress
                value={progressPercent}
                indicatorColor={getProgressColor(progressPercent)}
              />
              <div className="flex justify-end gap-1 mt-4 text-sm">
                <button className="px-3 h-[30px] border rounded">수정</button>
                <button className="px-3 h-[30px] border border-[red] rounded text-red-500">
                  삭제
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
