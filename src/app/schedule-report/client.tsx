"use client";

import React, { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import WeeklyUsageAnalysisChart from "@/components/schedule-report/weeklyUsageAnalysisChart";
import CategoryUsageAnalysisChart from "@/components/schedule-report/categoryUsageAnalysisChart";
import ImportantPlansComponent from "@/components/schedule-report/importantPlansComponent";

import { getPeriodDateRanges } from "@/lib/utils";

import "../../styles/calendar.css";

import { CategoryData } from "@/types/plan";

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
  const searchParmas = useSearchParams();
  const urlPeriod = searchParmas.get("period") || "week";

  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const [periodType, setPeriodType] = useState(urlPeriod);

  const [categoryUsageAnalysisData, setCategoryUsageAnalysisData] =
    useState<CategoryUsageData | null>(null);

  const [currentImportantPlans, setCurrentImportantPlans] = useState([]);
  const [nextImportantPlans, setNextImportantPlans] = useState([]);

  const router = useRouter();

  const { data: session } = useSession();

  const periodMap: PeriodObject = {
    week: "주",
    month: "월",
    custom: "사용자 지정 기",
  };

  useEffect(() => {
    setPeriodType(urlPeriod);
  }, [urlPeriod]);

  useEffect(() => {
    if (!session) return;
    const categoryUsageData = async () => {
      const startDate = dayjs(date?.from).format("YYYY-MM-DD");
      const endDate = dayjs(date?.to).format("YYYY-MM-DD");

      let categoryUrl = `${process.env.NEXT_PUBLIC_API_URL}/plans/dashboard/category-time/?period=${periodType}`;

      let importantPlanUrl = `${process.env.NEXT_PUBLIC_API_URL}/plans/important_plan/?period=${periodType}`;

      if (periodType === "custom" && startDate && endDate) {
        categoryUrl += `&start_date=${startDate}&end_date=${endDate}`;
        importantPlanUrl += `&start_date=${startDate}&end_date=${endDate}`;
      }
      const categoryRes = await fetch(categoryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`, // Bearer token 추가
        },
        credentials: "include",
      });
      const importantPlanRes = await fetch(importantPlanUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`, // Bearer token 추가
        },
        credentials: "include",
      });

      const cateogyResJson = await categoryRes?.json();
      const importantPlanResJson = await importantPlanRes?.json();

      setCategoryUsageAnalysisData(cateogyResJson);
      setCurrentImportantPlans(importantPlanResJson?.current_important_plans);
      setNextImportantPlans(importantPlanResJson?.next_important_plans);
    };
    categoryUsageData();
  }, [periodType, date, session, date?.from, date?.to]);

  const handlePeriodChange = (type: string) => {
    const params = new URLSearchParams(searchParmas.toString());
    params.set("period", type); // 기존 값 유지하면서 period만 변경
    router.push(`/schedule-report?${params.toString()}`);
  };

  const HeaderSection = () => {
    return (
      <div className="sm:flex sm:justify-between mb-0 sm:mb-3 ">
        <h1 className="font-bold text-2xl mb-4 sm:mb-0">Lifestyle Dashboard</h1>
        <div className="h-10 p-1 sm:w-[400px] w-full flex bg-[#f3f4f6] sm:mb-0 mb-6">
          {["week", "month", "custom"].map((type) => (
            <button
              key={type}
              className={`w-1/3 ${
                periodType === type ? "bg-white font-bold" : ""
              }`}
              onClick={() => handlePeriodChange(type)}
            >
              {type === "week" && "주간"}
              {type === "month" && "월간"}
              {type === "custom" && "사용자지정"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 ">
      <HeaderSection />
      <p className="text-right mb-3 text-gray-500 font-semibold ">
        {getPeriodDateRanges(periodType as "week" | "month", "current")}
      </p>
      {periodType === "custom" && (
        <div className="border p-6 mb-6 rounded">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "y MM dd")} -{" "}
                      {format(date.to, "y MM dd")}
                    </>
                  ) : (
                    format(date.from, "y MM dd")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
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
          <h3 className="text-xl font-bold mb-3">
            {periodMap[periodType]}간 시간 사용 분석
          </h3>
          <WeeklyUsageAnalysisChart data={categoryUsageAnalysisData} />
        </div>
        <div className="border bg-white flex-1 rounded w-full sm:w-1/2 p-6">
          <h3 className="text-xl font-bold mb-3">카테고리별 시간 할애</h3>
          <CategoryUsageAnalysisChart
            data={categoryUsageAnalysisData}
            periodType={periodType}
            date={date}
          />
        </div>
      </div>
    </div>
  );
}
