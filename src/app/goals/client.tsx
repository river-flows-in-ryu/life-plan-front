"use client";

import React, { useEffect, useState } from "react";

import GoalPageHeader from "@/components/goals/goalPageHeader";
import GoalTips from "@/components/goals/goalTips";
import GoalInputSection from "@/components/goals/goalInputSection";
import { useSession } from "next-auth/react";
import { Progress } from "@/components/ui/progress";

import Pagination from "@/utils/pagination";

interface Props {
  categoryData: { id: number; name: string }[];
}

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
}

const PERIOD_MAP = {
  daily: "일일",
  weekly: "주간",
  monthly: "월간",
};

export default function Client({ categoryData }: Props) {
  const [goalStatus, setGoalStatus] = useState<"ongoing" | "done">("ongoing");

  const [goalTitle, setGoalTitle] = useState("");

  const [ongoinglData, setOngoingData] = useState<Goals[] | []>([]);
  const [completedData, setCompletedData] = useState<Goals[] | []>([]);

  const [page, setPage] = useState(1);

  const { data: session } = useSession();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        if (session) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          });
          if (res.ok) {
            const resJson = await res.json();
            console.log(resJson);
            setOngoingData(resJson?.ongoing);
            setCompletedData(resJson?.completed);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleFetch();
  }, [session]);

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

  const badgeCount = 0;
  const activeGoals = ongoinglData?.length || 0;
  const completedCount = completedData?.length || 0;

  return (
    <div className="py-8 px-4">
      <GoalPageHeader badgeCount={badgeCount} activeGoals={activeGoals} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 flex flex-col gap-6">
          <div className="border rounded">
            <div className="">
              <div className="px-6 pt-6 pb-3">
                <h3 className="text-2xl font-semibold">내 목표</h3>
                <p className="text-sm mt-1">
                  설정한 목표와 진행 상황을 확인하세요
                </p>
              </div>
            </div>
            <div className="px-6">
              <div className="h-10 items-center justify-center p-1 bg-[#f3f4f6]">
                <button
                  className={`w-1/2 h-full text-sm font-medium ${
                    goalStatus === "ongoing" ? "bg-white" : "text-gray-500"
                  }`}
                  onClick={() => setGoalStatus("ongoing")}
                >
                  진행 중 ({activeGoals || 0})
                </button>
                <button
                  className={`w-1/2 h-full text-sm font-medium ${
                    goalStatus === "done" ? "bg-white" : "text-gray-500"
                  }`}
                  onClick={() => setGoalStatus("done")}
                >
                  종료 ({completedCount || 0})
                </button>
              </div>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ongoinglData?.map((item) => {
                  const {
                    start_date,
                    end_date,
                    goal_type,
                    period_type,
                    target,
                    title,
                    id,
                  } = item;
                  return (
                    <div
                      className="rounded-lg"
                      key={id}
                      style={{ border: `1px solid ${getProgressColor(80)}` }}
                    >
                      <div
                        className="p-4 rounded-t"
                        style={{ backgroundColor: getProgressColor(60) }}
                      >
                        <></>
                        <div>
                          <h3 className="font-medium text-lg text-white">
                            {title}
                          </h3>
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
                          <span>
                            목표 : {target}
                            {goal_type === "count" ? "회" : "시간"}
                          </span>
                          <span>현재 : todo</span>
                        </div>
                        <span>진행률 : {}%</span>
                        <Progress
                          value={70}
                          indicatorColor={getProgressColor(80)}
                        />
                        <div className="flex justify-end gap-1 mt-4 text-sm">
                          <button className="px-3">수정</button>
                          <button className="px-3">삭제</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-center">
                <Pagination
                  total={2}
                  pageSize={6}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>
          <div className=" border rounded ">
            <div className="px-6 pt-6 pb-3"></div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <GoalInputSection categoryData={categoryData} />
          <GoalTips />
        </div>
      </div>
    </div>
  );
}
