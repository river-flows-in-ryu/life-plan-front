import React from "react";

import Link from "next/link";

import { Target, ArrowRight, Plus } from "lucide-react";

import { Goals } from "@/types/goal";

import { Progress } from "@/components/ui/progress";

interface Props {
  goals: Goals[];
}

export default function ActiveGoalProgress({ goals }: Props) {
  const progressGoals = goals?.slice(0, 3);

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <Target width={16} height={16} />
          목표 진행률
        </h3>
        <Link href="/goals">
          <ArrowRight width={16} height={16} />
        </Link>
      </div>
      {goals?.length === 0 ? (
        <div className="py-5">
          <div className="flex flex-col justify-center">
            <div className="w-14 h-14 p-3 bg-gray-100 rounded-full mx-auto mb-3">
              <Target width={32} height={32} />
            </div>
            <p className="mb-1 text-center text-gray-700 font-medium">
              오늘 일정이 없습니다.
            </p>
            <p className="text-sm text-gray-500 mb-4 text-center">
              목표를 설정하고 달성해나가는 과정에서 성취감을 느껴보세요.
            </p>
            <div className="flex flex-wrap gap-2 justify-center ">
              <Link href="/goals">
                <button className="gap-1 flex items-center px-4 py-2 text-sm bg-black text-white rounded">
                  <Plus width={16} height={16} color="white" />
                  일정 추가하기
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {progressGoals &&
            progressGoals?.map((goal) => {
              const {
                id,
                current,
                goal_type,
                start_date,
                end_date,
                title,
                target,
              } = goal;
              return (
                <div key={id}>
                  <p className="text-sm font-medium truncate">{title}</p>
                  <div className="flex justify-between text-xs my-2">
                    <span className="text-muted-foreground">
                      {current}/{target} {goal_type === "count" ? "회" : "시간"}
                    </span>
                    <span className="font-medium">
                      {Math.round((current / target) * 100)}%
                    </span>
                  </div>
                  <Progress value={(current / target) * 100} />
                  <div className="mt-2 flex flex-col gap-1 text-gray-900">
                    <p className="text-xs text-right">시작일 :{start_date}</p>
                    <p className="text-xs text-right">목표일 :{end_date}</p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
      <Link href="/goals">
        <button className="w-full h-10 flex justify-center border items-center mt-4 rounded text-sm font-medium gap-2">
          <Plus width={16} height={16} /> 새 목표 추가
        </button>
      </Link>
    </div>
  );
}
