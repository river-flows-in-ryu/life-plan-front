"use client";

import { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Calendar from "react-calendar";
import Link from "next/link";

import WeeklyUsageAnalysisChart from "@/components/schedule-report/weeklyUsageAnalysisChart";
import CategoryUsageAnalysisChart from "@/components/schedule-report/categoryUsageAnalysisChart";
import ImportantPlansComponent from "@/components/schedule-report/importantPlansComponent";

import "../../styles/calendar.css";

import { CategoryData, Plan } from "@/types/plan";

import { useSession } from "next-auth/react";

dayjs.locale("ko");
ChartJS.register(ArcElement, Tooltip, Legend);

interface PeriodObject {
  [key: string]: string;
}

interface CategoryUsageData {
  total_minutes: number;
  data: CategoryData[];
  future_plans: [];
}

export default function Client() {
  const [periodType, setPeriodType] = useState("week");

  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null);

  const [categoryUsageAnalysisData, setCategoryUsageAnalysisData] =
    useState<CategoryUsageData | null>(null);

  const [currentImportantPlans, setCurrentImportantPlans] = useState([]);
  const [nextImportantPlans, setNextImportantPlans] = useState([]);

  const { data: session } = useSession();
  // console.log("프론트에서" + session);
  console.log(session);

  const periodMap: PeriodObject = {
    week: "주",
    month: "월",
    custom: "사용자 지정 기",
  };

  useEffect(() => {
    const categoryUsageData = async () => {
      const startDate = dayjs(selectedDate?.[0]).format("YYYY-MM-DD");
      const endDate = dayjs(selectedDate?.[1]).format("YYYY-MM-DD");

      let categoryUrl = `${process.env.NEXT_PUBLIC_API_URL}/plans/dashboard/category-time/?userId=2&period=${periodType}`;

      let importantPlanUrl = `${process.env.NEXT_PUBLIC_API_URL}/plans/important_plan/?userId=2&period=${periodType}`;

      if (periodType === "custom" && startDate && endDate) {
        categoryUrl += `&start_date=${startDate}&end_date=${endDate}`;
        importantPlanUrl += `&start_date=${startDate}&end_date=${endDate}`;
      }
      const categoryRes = await fetch(categoryUrl);
      const importantPlanRes = await fetch(importantPlanUrl);

      const cateogyResJson = await categoryRes?.json();
      const importantPlanResJson = await importantPlanRes?.json();

      setCategoryUsageAnalysisData(cateogyResJson);
      setCurrentImportantPlans(importantPlanResJson?.current_important_plans);
      setNextImportantPlans(importantPlanResJson?.next_important_plans);
    };
    categoryUsageData();
  }, [periodType, selectedDate?.[0], selectedDate?.[1]]);

  return (
    <div className="p-4 bg-[#f3f4f6]">
      <Link href="/schedule">일정 추가</Link>
      <h1 className="font-bold text-2xl mb-5">Lifestyle Dashboard</h1>
      <div className="flex h-8">
        <button
          onClick={() => setPeriodType("week")}
          className={`flex-1 ${periodType === "week" ? "bg-white" : ""}`}
        >
          주간
        </button>
        <button
          onClick={() => setPeriodType("month")}
          className={`flex-1 ${periodType === "month" ? "bg-white" : ""}`}
        >
          월간
        </button>
        <button
          onClick={() => setPeriodType("custom")}
          className={`flex-1 ${periodType === "custom" ? "bg-white" : ""}`}
        >
          사용자지정
        </button>
      </div>
      {periodType === "custom" && ( //
        <Calendar
          selectRange={true}
          locale="ko"
          showNeighboringMonth={false}
          calendarType="gregory"
          onChange={(value: any) => setSelectedDate(value)}
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
        />
      )}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap ">
        {periodType !== "custom" ? (
          <>
            <ImportantPlansComponent
              data={currentImportantPlans}
              periodType={periodType}
              when={"current"}
            />
            <ImportantPlansComponent
              data={nextImportantPlans}
              periodType={periodType}
              when={"next"}
            />
          </>
        ) : (
          <ImportantPlansComponent
            data={currentImportantPlans}
            periodType={periodType}
          />
        )}
      </div>
      <div className="flex sm:flex-row flex-col flex-wrap gap-4 mt-2.5">
        <div className="border bg-white flex-1 rounded w-full sm:w-1/2  p-6">
          <h3 className="text-xl font-bold">
            {periodMap[periodType]}간 시간 사용 분석
          </h3>
          <WeeklyUsageAnalysisChart data={categoryUsageAnalysisData} />
        </div>
        <div className="border bg-white flex-1 rounded w-full sm:w-1/2 p-6">
          <h3 className="text-xl font-bold">카테고리별 시간 할애</h3>
          <CategoryUsageAnalysisChart data={categoryUsageAnalysisData} />
        </div>
      </div>
    </div>
  );
}
