import React from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

import circles from "../../../public/target.png";

import { Goals, PeriodType } from "@/types/goal";
import dayjs from "dayjs";

interface QuickStartGoal {
  id: number;
  title: string;
  category: number;
  goal_type: string;
  period_type: PeriodType;
  target: number;
}

const quickStartGoals: QuickStartGoal[] = [
  {
    id: 1,
    title: "1시간 독서하기",
    category: 7,
    goal_type: "time",
    period_type: "daily",
    target: 1,
  },
  {
    id: 2,
    title: "주 3회 운동하기",
    category: 1,
    goal_type: "count",
    period_type: "weekly",
    target: 3,
  },
  {
    id: 3,
    title: "한 달에 책 2권 읽기",
    category: 7,
    goal_type: "count",
    period_type: "monthly",
    target: 2,
  },
];

const PERIOD_MAP: Record<Goals["period_type"], string> = {
  daily: "일일",
  weekly: "주간",
  monthly: "월간",
};

const changeGoalStartEndDate = (type: string) => {
  const today = dayjs().format("YYYY-MM-DD");
  let endDate = today;

  if (type === "weekly") {
    endDate = dayjs().add(6, "day").format("YYYY-MM-DD");
  } else if (type === "monthly") {
    endDate = dayjs(today, "YYYY-MM-DD")
      .add(1, "month")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
  }
  return { startDate: today, endDate };
};

export default function EmptyOngoingGoal() {
  const { data: session } = useSession();

  const handleClickAddSampleGoal = async (id: number) => {
    const sampleData = quickStartGoals[id - 1];
    const { title, category, target, goal_type, period_type } = sampleData;
    const { startDate, endDate } = changeGoalStartEndDate(
      sampleData?.period_type
    );
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          title,
          category,
          goal_type,
          period_type,
          target,
          start_date: startDate,
          end_date: endDate,
        }),
      });
      const resJson = await res.json();
      if (resJson?.message === "SUCCESS") {
        alert("성공적으로 추가되었습니다.");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col justify-center">
      <div className="mx-auto mb-6">
        <div className="w-[120px] h-[120px] rounded-full flex justify-center items-center bg-gray-50 ">
          <Image
            src={circles}
            alt="target_flaction_img"
            width={64}
            height={64}
          />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">아직 설정된 목표가 없습니다.</h3>
      <p className=" text-gray-500 mb-8">
        시작이 반이다! 지금 바로 첫 목표를 설정하고 성취감을 느껴보세요.
      </p>

      <div className="grid gird-cols-1 sm:grid-cols-3 gap-4">
        {quickStartGoals?.map((goal) => {
          const { id, title, target, goal_type, period_type } = goal;
          const { startDate, endDate } = changeGoalStartEndDate(period_type);

          return (
            <div key={id} className="p-4 border tounded text-left">
              <h3 className="mb-2 font-medium">{title}</h3>
              <div className="text-xs mb-3 text-gray-500">
                <div className="flex justify-between mb-1">
                  <span className=" font-bold">{PERIOD_MAP[period_type]}</span>
                  <span className="font-bold">
                    목표 : {target}
                    {goal_type === "count" ? "회" : "시간"}
                  </span>
                </div>
                <span className="block text-right ">시작 : {startDate}</span>
                {startDate !== endDate && (
                  <span className="block text-right ">종료 : {endDate}</span>
                )}
              </div>
              <button
                className="w-full h-10 border rounded text-sm font-medium"
                onClick={() => handleClickAddSampleGoal(id)}
              >
                +{"  "} 이 목표 추가하기
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
