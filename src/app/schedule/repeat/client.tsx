"use client";

import React, { useState } from "react";

import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import star from "../../../../public/star.png";
import colorStar from "../../../../public/star-color.png";
import Image from "next/image";

type DayCategory = "weekdays" | "weekend" | "custom";

interface Props {
  categoryData: { id: string; name: string }[];
}

export default function Client({ categoryData }: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const [dayCategory, setDayCategory] = useState<DayCategory>("weekdays");

  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [title, setTitle] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>();

  const [selectedColor, setSelectedColor] = useState<string>("");

  const [isImportant, setIsImportant] = useState<boolean>(false);

  const dayCategoryLabel = {
    weekdays: "평일",
    weekend: "주말",
    custom: "요일 지정",
  };

  const weekdays = [
    { value: "monday", label: "월" },
    { value: "tuesday", label: "화" },
    { value: "wednesday", label: "수" },
    { value: "thursday", label: "목" },
    { value: "friday", label: "금" },
    { value: "saturday", label: "토" },
    { value: "sunday", label: "일" },
  ];

  const dayCategoryList: DayCategory[] = ["weekdays", "weekend", "custom"];

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
          <div className="mb-6">
            <p className="mb-3 font-medium">기간 설정</p>
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
          <div>
            <span className="font-medium">반복 패턴</span>
            <div className="h-10 p-1  w-full flex bg-[#f3f4f6] mb-6 mt-3">
              {dayCategoryList?.map((type: DayCategory) => (
                <button
                  key={type}
                  className={`w-1/3 ${
                    dayCategory === type ? "bg-white font-bold" : ""
                  }`}
                  onClick={() => setDayCategory(type)}
                >
                  {dayCategoryLabel[type]}
                </button>
              ))}
            </div>
            {dayCategory === "custom" && (
              <div className="grid grid-cols-5 gap-2 sm:flex sm:gap-5">
                {weekdays?.map((day: { value: string; label: string }) => {
                  const { value, label } = day;
                  const isSelected = selectedWeekdays?.includes(value);
                  return (
                    <button
                      key={value}
                      className={`px-4 py-1.5 rounded ${
                        isSelected
                          ? "bg-black text-white border-none"
                          : "border"
                      }`}
                      onClick={() => handleClickToggleDays(value)}
                    >
                      <span className="sm:hidden">{label}</span>
                      <span className="hidden sm:inline">{label}요일</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
            <div className="">
              <label className="block mb-2 font-medium">시작 시간</label>
              <input
                className="border border-[#e5e7eb] w-full h-10 pl-2"
                type="time"
                name="appt"
                min="00:00"
                max="24:00"
                onChange={(event) => setStartTime(event?.target.value)}
                value={startTime}
              />
            </div>
            <div className="">
              <label className="block mb-2 font-medium">종료 시간</label>
              <input
                className="border border-[#e5e7eb] w-full h-10 pl-2"
                type="time"
                name="appt"
                min="00:00"
                max="24:00"
                onChange={(event) => setEndTime(event?.target.value)}
                value={endTime}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
            <div className="">
              <label className="block mb-2 font-medium">일정 제목</label>
              <input
                type="text"
                onChange={(event) => setTitle(event?.target?.value)}
                value={title}
                placeholder="일정 제목을 입력해주세요"
                className="h-10 w-full border rounded p-3"
              />
            </div>
            <div className="">
              <label className="block mb-2 font-medium">카테고리</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                required
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Cateogry" />
                </SelectTrigger>
                <SelectContent>
                  {categoryData?.map((categoryItem) => {
                    const { id, name } = categoryItem;
                    return (
                      <SelectItem value={name} key={id}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
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
          <div className="flex">
            <div className="flex-1">
              <p>중요 일정으로 표시</p>
              <span>중요 일정은 강조 표시됩니다.</span>
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
          <div>
            <p></p>
            <div className="hidden sm:block border rounded">
              <div className="max-h-[200px]">
                <table className="w-full">
                  <thead className="sticky top-0 h-10">
                    <tr>
                      <th>날짜</th>
                      <th>요일</th>
                      <th>시간</th>
                      <th>제목</th>
                      <th>중요</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
