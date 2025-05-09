import React from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  categoryData: { id: number; name: string }[];
}

export default function GoalInputSection({ categoryData }: Props) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  return (
    //
    <div className="border rounded p-6">
      <h3>새 목표 추가</h3>
      <p>새로운 목표를 설정하고 달성해보세요</p>
      <label className="block">목표 제목</label>
      <input
        type="text"
        className="w-full h-10 border rounded px-3 py-2 text-sm"
        placeholder="목표 제목을 입력하세요"
      />
      <label>카테고리</label>
      <Select>
        <SelectTrigger className="">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryData?.map((item) => {
            const { id, name } = item;
            return <SelectItem value={String(id)}>{name}</SelectItem>;
          })}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>목표 유형</label>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">시간</SelectItem>
              <SelectItem value="count">횟수</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label>기간</label>
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">일일</SelectItem>
              <SelectItem value="weekly">주간</SelectItem>
              <SelectItem value="monthly">월간</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <label>목표치 (시간 / 횟수)</label>
      <input
        type="number"
        className="w-full h-10 border rounded px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>시작일</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {endDate ? (
                  format(endDate, "yyyy.MM.dd")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label>종료일</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {startDate ? (
                  format(startDate, "yyyy.MM.dd")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <button className="w-full h-10 rounded bg-black text-white">
        목표 추가
      </button>
    </div>
  );
}
