"use client";
import React, { useState, useEffect, useMemo } from "react";

import Calendar from "react-calendar";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import Link from "next/link";

import TimeWheel from "@/components/schedule/timeWheel";
import ScheduleForm from "@/components/schedule/scheduleForm";

import { Plan } from "@/types/plan";

import "../../styles/calendar.css";

import { useSession } from "next-auth/react";

type DateValue = Date | null;

interface HolidayType {
  dateKind: string;
  dateName: string;
  isHoliday: "Y" | "N";
  locdate: number;
  seq: number;
}

//토요일 색상 변경
export default function Client() {
  const [data, setData] = useState<Plan[]>([]);

  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  const [resetSignal, setResetSignal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1);
  const [currendYear, setCurrentYear] = useState(dayjs().year());

  const [scheduleDates, setScheduleDates] = useState<string[]>([]);

  const [holiday, setHoliday] = useState<HolidayType[]>([]);

  const { data: session } = useSession();

  const selectedPlan = useMemo(() => {
    if (selectedId) {
      return data?.find((d) => d.id === selectedId || null);
    }
  }, [selectedId, data]);

  useEffect(() => {
    if (!session) {
      setScheduleDates([]);
      setHoliday([]);
      return;
    }

    const fetchIsPlanDays = async () => {
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/plans/plan-dates?year=${currendYear}&month=${currentMonth}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`, // Bearer token 추가
            },
            credentials: "include",
          }
        );
        const data1 = await res1.json();
        setScheduleDates(data1?.data);

        // 공휴일 api
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_OPEN_API_URL}?serviceKey=${
            process.env.NEXT_PUBLIC_OPEN_API_KEY
          }&solYear=${currendYear}&solMonth=${
            currentMonth < 10 ? `0${currentMonth}` : currentMonth
          }&_type=json`
        );
        const data2 = await res2.json();
        setHoliday(data2?.response?.body?.items?.item);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIsPlanDays();
  }, [currentMonth, currendYear, session]);

  useEffect(() => {
    if (!session) return;
    if (selectedDate) {
      const fetchPlans = async () => {
        const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/plans?date=${formattedDate}`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
              },
            }
          );
          const data = await res.json();

          const transformedData = data.map((plan: any) => ({
            id: plan.id,
            startTime: plan.start_time.slice(0, 5),
            endTime: plan.end_time.slice(0, 5),
            label: plan.label,
            description: plan.description,
            isImportant: plan.is_important,
            color: plan.color,
          }));
          setData(transformedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchPlans();
    }
  }, [selectedDate, session]);
  const cleanData = async () => {
    setResetSignal(true);
    setSelectedId(null);
  };

  useEffect(() => {
    cleanData();
  }, [selectedDate]);

  const formProps = {
    selectedDate,
    setData,
    data,
    cleanData,
    selectedId,
    setSelectedId,
    selectedPlan,
    resetSignal,
    setResetSignal,
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const formattedDate = Number(dayjs(date).format("YYYYMMDD"));

    const holidayArray = Array.isArray(holiday) ? holiday : [holiday];

    const isHoliday = holidayArray.find(
      (h: HolidayType) => h?.locdate === formattedDate
    );

    if (isHoliday) {
      return "react-calendar__month-view__days__day--weekend";
    }

    if (date.getDay() === 6) {
      return "custom-saturday";
    }

    return null;
  };

  //todo
  const handleDateChange = (value: any) => {
    setSelectedDate(value);
  };

  const handleClickCaptureImage = () => {
    const target = document.getElementById("capture");
    if (!target) {
      return alert("사진 저장에 실패했습니다.");
    }
    const formattedDate = dayjs().format("YYYYMMDD");
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = canvas.toDataURL("image/png");
      link.download = `${formattedDate}_JPlan.png`;
      link.click();
      document.body.removeChild(link);
    });
  };

  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    if (scheduleDates?.includes(formattedDate)) {
      return (
        <div className="dot-container">
          <span className="green-dot" />
        </div>
      );
    }
    return null;
  };

  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      setCurrentMonth(dayjs(activeStartDate).month() + 1);
      setCurrentYear(dayjs(activeStartDate).year());
    }
  };

  return (
    <div className=" py-8">
      <h1 className="text-2xl mb-2 font-bold pl-4">일정 관리</h1>
      <div className="flex flex-col sm:flex-row  p-4 gap-4 ">
        <div className="flex flex-col sm:flex-row gap-4" id="capture">
          <div className="border border-[#e5e7eb] rounded-2xl bg-white sm:w-[315px] pb-10 sm:pb-0">
            <h3 className="p-4 text-2xl	font-bold">Calendar</h3>
            <Calendar
              locale="ko"
              calendarType="gregory"
              showNeighboringMonth={false}
              tileClassName={getTileClassName}
              tileContent={tileContent}
              onChange={handleDateChange}
              formatDay={(locale, date) =>
                date.toLocaleString("en", { day: "numeric" })
              }
              onActiveStartDateChange={handleActiveStartDateChange}
            />

            <p className="text-red-500 flex justify-center mt-5 h-5">
              {(() => {
                const holidayArray = Array.isArray(holiday)
                  ? holiday
                  : [holiday];
                return holidayArray
                  .map((h) => {
                    if (
                      h?.locdate ===
                      Number(dayjs(selectedDate).format("YYYYMMDD"))
                    ) {
                      return `*${h.dateName}`;
                    }
                    return null;
                  })
                  .filter(Boolean);
              })()}
            </p>
          </div>
          <div className="border border-[#e5e7eb] rounded-2xl bg-white">
            <h3 className="p-4 text-2xl	font-bold">Timeline</h3>
            <div className="flex justify-end pr-4">
              {data?.length !== 0 && (
                <button
                  onClick={handleClickCaptureImage}
                  className="text-gray-400"
                >
                  Capture
                </button>
              )}
            </div>
            <TimeWheel plans={data} setSelectedId={setSelectedId} />
            <ul className="pl-5 mt-5 pb-5">
              {data?.map((plan) => {
                return (
                  <li key={plan?.id} className="flex gap-1 mt-1.5">
                    <div
                      className="w-5 h-5"
                      style={{ backgroundColor: plan?.color }}
                    />
                    <span
                      className={`text-[${plan?.color}] max-w-[200px] truncate`}
                    >
                      {plan?.label}
                    </span>
                    <span className={`text-[${plan?.color}]`}>
                      {plan?.startTime}~{plan?.endTime}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ScheduleForm {...formProps} />
      </div>
    </div>
  );
}
