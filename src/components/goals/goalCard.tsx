import React, { useState } from "react";

import { useSession } from "next-auth/react";

import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

import EmptyOngoingGoal from "./emptyOngoingGoal";

import { Goals } from "@/types/goal";

import EmptyCompletedGoal from "./emptyCompletedGoal";

interface Props {
  data: Goals[];
  handleClickDelete: (id: number) => void;
  goalStatus: "ongoing" | "completed";
  setGoalStatus: (value: "ongoing" | "completed") => void;
}

export default function GoalCard({
  data,
  handleClickDelete,
  goalStatus,
  setGoalStatus,
}: Props) {
  const [editId, setEditId] = useState<number | null>(null);

  const [currentValues, setCurrentValues] = useState<
    Record<number, number | undefined>
  >({});

  const { data: session } = useSession();

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

  const handleUpdateGoal = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/update-current/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(currentValues),
        }
      );
      if (res.ok) {
        const resJson = await res.json();
        alert(resJson?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const PERIOD_MAP: Record<Goals["period_type"], string> = {
    daily: "일일",
    weekly: "주간",
    monthly: "월간",
  };

  return (
    <>
      {data?.length === 0 ? (
        <div className="pt-12 pb-0 sm:pb-12 px-4 text-center">
          {goalStatus === "ongoing" ? (
            <EmptyOngoingGoal />
          ) : (
            <EmptyCompletedGoal setGoalStatus={setGoalStatus} />
          )}
        </div>
      ) : (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              target > 0
                ? Math.min(Math.floor((current / target) * 100), 100)
                : 0;

            return (
              <div
                className="rounded-lg"
                key={id}
                style={{
                  border: `1px solid ${getProgressColor(progressPercent)}`,
                }}
              >
                <div
                  className="p-4 rounded-t"
                  style={{ backgroundColor: getProgressColor(progressPercent) }}
                >
                  <></>
                  <div>
                    <h3 className="font-medium text-lg text-white">{title}</h3>
                    <div className="flex justify-between   mt-1 text-white">
                      <div className="flex gap-2 items-center">
                        <div className="px-2.5 py-0.5 rounded-full text-xs bg-[#ffffff80] text-black">
                          {PERIOD_MAP[period_type]}
                        </div>
                        <span className="text-xs">
                          {start_date} ~ {end_date}
                        </span>
                      </div>
                      {goalStatus === "completed" && (
                        <div className="px-2.5 py-0.5 rounded-full text-xs bg-black text-white">
                          종료
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 mb-4">
                  <div className="flex justify-between mb-3 text-sm font-medium">
                    <span className="font-medium">
                      목표 : {target}
                      {goal_type === "count" ? "회" : "시간"}
                    </span>
                    <span className="font-medium">
                      현재 : {current} {goal_type === "count" ? "회" : "시간"}
                    </span>
                  </div>
                  <div className="mb-4">
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
                  </div>
                  {editId === id && (
                    <div className="mt-2 mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>진행 상황 업데이트</span>
                        <span>
                          {currentValues[id] ?? current} / {target}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[current]}
                        max={target}
                        min={0}
                        value={[currentValues[id] ?? current]}
                        onValueChange={(v) =>
                          setCurrentValues((prev) => ({
                            ...prev,
                            [id]: v[0],
                          }))
                        }
                        className="h-2 w-full grow"
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-1  text-sm">
                    <button
                      className={`px-3 h-[30px] border rounded ${
                        editId === id ? "border-blue-500 text-blue-500" : ""
                      }`}
                      onClick={async () => {
                        if (editId === id) {
                          await handleUpdateGoal();
                          window.location.reload();
                        } else {
                          setEditId(id);
                        }
                      }}
                    >
                      {editId === id ? "저장" : "수정"}
                    </button>
                    <button
                      className="px-3 h-[30px] border border-[red] rounded text-red-500"
                      onClick={() => handleClickDelete(id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
