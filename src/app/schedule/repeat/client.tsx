"use client";

import React, { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

import { DateRange } from "react-day-picker";

import SchedulePreviewTable from "@/components/schedule/repeat/schedulePreviewTable";
import TimeRangePicker from "@/components/schedule/repeat/timeRangePicker";
import DateRangeSelector from "@/components/schedule/repeat/dateRangeSelector";
import WeekdayPatternSelector from "@/components/schedule/repeat/weekdayPatternSelector";

import star from "../../../../public/star.png";
import colorStar from "../../../../public/star-color.png";
import Image from "next/image";
import dayjs from "dayjs";

const TitleAndCategorySelector = dynamic(
  () => import("@/components/schedule/repeat/\btitleAndCategorySelector"),
  { ssr: false }
);

type DayCategory = "weekdays" | "weekend" | "custom";

interface Props {
  categoryData: { id: string; name: string }[];
}

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface SampleData {
  day: string;
  dayOfTheWeek: Weekday;
  startTime: string;
  endTime: string;
  title: string;
  isImportant: boolean;
}

export default function Client({ categoryData }: Props) {
  const { data: session } = useSession();

  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const [dayCategory, setDayCategory] = useState<DayCategory>("weekdays");

  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [title, setTitle] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>();

  const [selectedColor, setSelectedColor] = useState<string>("");

  const [isImportant, setIsImportant] = useState<boolean>(false);

  const [sampleData, setSampleData] = useState<SampleData[]>([]);

  useEffect(() => {
    if (!date?.from || !date?.to) return;
    const start = dayjs(date?.from);
    const end = dayjs(date?.to);

    const diff = end?.diff(start, "days");
    if (diff > 31) {
      alert("한달을 초과할수 없습니다.");
      setDate(undefined);
    }
  }, [date]);

  useEffect(() => {
    if (
      !date?.from ||
      !date?.to ||
      !startTime ||
      !endTime ||
      !title ||
      !selectedCategory
    )
      return;

    const start = dayjs(date.from);
    const end = dayjs(date.to);
    let current = start;

    const result = [];

    while (current.isSame(end) || current.isBefore(end)) {
      const day = current.format("dddd").toLowerCase();

      const isWeekday = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ].includes(day);
      const isWeekend = ["saturday", "sunday"].includes(day);
      const isCustom = selectedWeekdays?.includes(day);

      const shouldInclude =
        (dayCategory === "weekdays" && isWeekday) ||
        (dayCategory === "weekend" && isWeekend) ||
        (dayCategory === "custom" && isCustom);

      if (shouldInclude) {
        result.push({
          day: current.format("YYYY-MM-DD"),
          dayOfTheWeek: current.format("dddd").toLowerCase() as Weekday,
          startTime: startTime,
          endTime: endTime,
          title: title,
          isImportant: isImportant,
        });
      }

      current = current.add(1, "day");
    }

    setSampleData(result);
  }, [
    date,
    dayCategory,
    selectedWeekdays,
    startTime,
    endTime,
    title,
    isImportant,
    selectedCategory,
  ]);

  const colorOptions = [
    { id: "red", color: "#ef4444" },
    { id: "orange", color: "#f97316" },
    { id: "yellow", color: "#eab308" },
    { id: "green", color: "#22c55e" },
    { id: "blue", color: "#3b82f6" },
    { id: "indigo", color: "#6366f1" },
    { id: "purple", color: "#a855f7" },
    { id: "pink", color: "#ec4899" },
    { id: "teal", color: "#14b8a6" },
    { id: "gray", color: "#9ca3af" },
  ];

  const handleClickToggleDays = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const reset = () => {
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setTitle("");
    setSelectedCategory("");
    setSelectedColor("");
    setIsImportant(false);
    setSampleData([]);
  };

  const postData = async () => {
    try {
      if (
        !date?.from ||
        !date?.to ||
        !dayCategory ||
        !selectedWeekdays ||
        !startTime ||
        !endTime ||
        !title ||
        !selectedCategory ||
        !selectedColor ||
        isImportant === undefined
      ) {
        alert("모든 정보를 입력하셔야 합니다.");
        return;
      }

      const categoryId = categoryData?.find(
        (item) => item.name === selectedCategory
      )?.id;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/recurring/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            start_date: dayjs(date?.from).format("YYYY-MM-DD"),
            end_date: dayjs(date?.to).format("YYYY-MM-DD"),
            day_category: dayCategory,
            custom_days: selectedWeekdays,
            start_time: startTime,
            end_time: endTime,
            label: title,
            category: categoryId,
            color: selectedColor,
            is_important: isImportant,
          }),
        }
      );
      const resJson = await res.json();
      alert(resJson?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const ColorSelector = () => {
    return (
      <div className="mt-6">
        <label className="block mb-2">색상 선택</label>
        <div className="grid gap-2 grid-cols-5 sm:flex">
          {colorOptions?.map((colorItem) => {
            const { id, color } = colorItem;
            const isSelectedColor = selectedColor === id;
            return (
              <button
                style={{ backgroundColor: color }}
                key={id}
                className={` rounded-full w-8 h-8 ${
                  isSelectedColor ? "border-2 border-black" : ""
                }`}
                onClick={() => setSelectedColor(id)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const ImportantToggle = () => {
    return (
      <div className="flex mt-4">
        <div className="flex-1">
          <p className="font-medium">중요 일정으로 표시</p>
          <span className="text-sm">중요 일정은 강조 표시됩니다.</span>
        </div>
        <div className="flex gap-2 ml-2">
          {isImportant ? (
            <Image
              src={colorStar}
              alt="flaction_star_img"
              className="w-5 h-5"
            />
          ) : (
            <Image src={star} alt="flaction_star_img" className="w-5 h-5" />
          )}
          <></>
          <Switch
            checked={isImportant}
            onCheckedChange={() => setIsImportant((prev) => !prev)}
            className=""
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 ">
      <h1 className="font-bold text-2xl mb-6 ">반복 일정 생성</h1>
      <div className="border rounded">
        <div className="p-6">
          <h3 className="text-xl font-bold">반복 일정 설정</h3>
          <span className="text-sm">
            지정한 기간 동안 반복되는 일정을 한 번에 생성합니다.
          </span>
        </div>
        <div className="p-4 ">
          <DateRangeSelector date={date} setDate={setDate} />
          <WeekdayPatternSelector
            dayCategory={dayCategory}
            setDayCategory={setDayCategory}
            selectedWeekdays={selectedWeekdays}
            handleClickToggleDays={handleClickToggleDays}
          />
          <TimeRangePicker
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
          <TitleAndCategorySelector
            title={title}
            setTitle={setTitle}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryData={categoryData}
          />
          <ColorSelector />
          <ImportantToggle />
          <SchedulePreviewTable sampleData={sampleData} />
        </div>
        <div className="p-6 flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-5 border-t">
          <button
            className="w-full sm:w-fit px-4 py-2 border rounded "
            onClick={reset}
          >
            리셋
          </button>
          <button
            className="w-full sm:w-fit px-4 py-2 border rounded bg-black text-white"
            onClick={postData}
          >
            일정 생성 ({sampleData?.length || 0}개)
          </button>
        </div>
      </div>
    </div>
  );
}
