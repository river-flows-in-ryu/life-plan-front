"use client";

import React, { useState } from "react";

import GoalPageHeader from "@/components/goals/goalPageHeader";
import GoalTips from "@/components/goals/goalTips";
import GoalInputSection from "@/components/goals/goalInputSection";

interface Props {
  categoryData: { id: number; name: string }[];
}

export default function Client({ categoryData }: Props) {
  const [goalStatus, setGoalStatus] = useState<"ongoing" | "done">("ongoing");

  const [goalTitle, setGoalTitle] = useState("");

  const badgeCount = 1;
  const activeGoals = 1;
  const completedCount = 0;

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
                  완료 ({completedCount || 0})
                </button>
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
