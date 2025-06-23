"use client";

import Calendar from "react-calendar";
import Link from "next/link";
import dayjs from "dayjs";

import { Plus } from "lucide-react";

import "@/styles/customCalendar.css";

import { Plan } from "@/types/plan";
import { Goals } from "@/types/goal";

import WeatherOverview from "@/components/home/weatherOverview";
import TodayTimeline from "@/components/home/todayTimeline";
import ActiveGoalProgress from "@/components/home/activeGoalProgress";
import CategoryTimeAnalysis from "@/components/home/categoryTimeAnalysis";

import { Calendar as CalendarIcon, Target, Timer } from "lucide-react";

interface Props {
  todayPlan: Plan[] | [];
  goals: Goals[];
  categoryTime: {
    data: { category__name: string; total_time: number }[];
    total_minutes: number;
  };
}

const getTotalTime = (array: Plan[] | []) => {
  const totalMinutes = array.reduce((total: number, range: Plan) => {
    const today = dayjs().format("YYYY-MM-DD");
    const start = dayjs(`${today}T${range.start_time}`);
    const end = dayjs(`${today}T${range.end_time}`);

    const diff = end.diff(start, "minute");
    return total + diff;
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = `${hours} h`;
  if (minutes > 0) {
    result += ` ${minutes} m`;
  }
  return result;
};

const goalSuccessRate = (goals: Goals[]) => {
  const { totalTarget, totalCurrent } = goals.reduce(
    (acc, item) => {
      return {
        totalTarget: acc.totalTarget + item.target,
        totalCurrent: acc.totalCurrent + item.current,
      };
    },
    { totalTarget: 0, totalCurrent: 0 }
  );

  if (totalTarget === 0) return "0";

  const rate = (totalCurrent / totalTarget) * 100;
  const decimal = rate % 1;
  return decimal === 0 ? `${Math.floor(rate)}` : `${rate.toFixed(1)}`;
};

const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
  if (view !== "month") return null;

  const day = date.getDay();
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) return "calendar-today";
  if (day === 0) return "calendar-sunday"; // 일요일
  if (day === 6) return "calendar-saturday"; // 토요일

  return "calendar-weekday"; // 평일
};

export default function Client({ todayPlan, goals, categoryTime }: Props) {
  return (
    <div className="py-8 px-4 sm:px-0">
      <div className="flex justify-between">
        <div className="flex flex-col mb-8">
          <h3 className="text-2xl font-semibold">대시보드</h3>
          <span className="text-sm">오늘의 일정과 목표를 확인하세요</span>
        </div>
        <button className="h-10 flex items-center gap-2 bg-black px-4 py-2 rounded">
          <Plus color="white" />
          <Link href="/schedule">
            <span className="text-white">일정추가</span>
          </Link>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 border rounded-lg">
          <div className="flex justify-between mb-2">
            <span className=" text-sm font-medium">오늘 일정</span>
            <CalendarIcon width={16} height={16} />
          </div>
          <p className="text-2xl font-bold">{todayPlan?.length || 0} 건</p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="flex justify-between mb-2">
            <span className=" text-sm font-medium">목표 달성률</span>
            <Target width={16} height={16} />
          </div>
          <p className="text-2xl font-bold">{goalSuccessRate(goals) || 0} %</p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="flex justify-between mb-2">
            <span className=" text-sm font-medium">활동 시간</span>
            <Timer width={16} height={16} />
          </div>
          <p className="text-2xl font-bold">{getTotalTime(todayPlan)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        <div>
          <div className="border rounded-lg hidden sm:block">
            <div className="px-6 pt-6 pb-3">
              <h3 className="font-semibold">미니 캘린더</h3>
            </div>
            <Calendar
              locale="ko"
              calendarType="gregory"
              showNeighboringMonth={false}
              tileClassName={getTileClassName}
              formatDay={(locale, date) =>
                date.toLocaleString("en", { day: "numeric" })
              }
              tileDisabled={() => true}
              className="custom-calendar-wrapper"
            />
          </div>
          <WeatherOverview />
        </div>
        <div>
          <TodayTimeline todayPlan={todayPlan} />
        </div>
        <div>
          <ActiveGoalProgress goals={goals} />
          <CategoryTimeAnalysis categoryTime={categoryTime} />
        </div>
      </div>
    </div>
  );
}
