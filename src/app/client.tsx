"use client";

import React, { useEffect, useState } from "react";

import Calendar from "react-calendar";

import { Plus } from "lucide-react";

import "@/styles/calendar.css";
import WeatherOverview from "@/components/home/weatherOverview";

import { Plan } from "@/types/plan";

import TodayTimeline from "@/components/home/todayTimeline";

interface Props {
  todayPlan: Plan[] | [];
}

export default function Client({ todayPlan }: Props) {
  return (
    <div className="py-8">
      <div className="flex justify-between">
        <div className="flex flex-col mb-8">
          <h3 className="text-2xl font-semibold">대시보드</h3>
          <span className="text-sm">오늘의 일정과 목표를 확인하세요</span>
        </div>
        <button className="h-10 flex items-center gap-2 bg-black px-4 py-2 rounded">
          <Plus color="white" />
          <span className="text-white">일정추가</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <div className="border rounded-lg">
            <div className="px-6 pt-6 pb-3">
              <h3 className="font-semibold">미니 캘린더</h3>
            </div>
            <Calendar
              locale="ko"
              calendarType="gregory"
              showNeighboringMonth={false}
              // tileDisabled={() => true}
              // tileClassName={getTileClassName}
              // tileContent={tileContent}
              // onChange={handleDateChange}
              formatDay={(locale, date) =>
                date.toLocaleString("en", { day: "numeric" })
              }
              className="custom-calendar-wrapper"
              // onActiveStartDateChange={handleActiveStartDateChange}
            />
          </div>
          <WeatherOverview />
        </div>
        <div>
          <TodayTimeline todayPlan={todayPlan} />
        </div>
        <></>
      </div>
    </div>
  );
}
