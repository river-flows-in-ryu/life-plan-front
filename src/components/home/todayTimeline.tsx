import React from "react";

import Link from "next/link";
import dayjs from "dayjs";

import { Plan } from "@/types/plan";

import {
  Clock4,
  Calendar,
  Plus,
  CircleCheck,
  Circle,
  Star,
} from "lucide-react";

interface Props {
  todayPlan: Plan[] | [];
}

export default function TodayTimeline({ todayPlan }: Props) {
  const getDiffTime = (
    startTime: string | undefined,
    endTime: string | undefined
  ): string => {
    const format = "HH:mm";
    const baseDate = "2000-01-01";

    let start = dayjs(`${baseDate}T${startTime}`);
    let end = dayjs(`${baseDate}T${endTime}`);

    // 종료시간이 시작시간보다 이전이라면 (즉, 다음날로 넘긴 경우)
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const diffMinutes = end.diff(start, "minute");

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (minutes === 0) {
      return `${String(hours)}시간`;
    } else {
      return `${String(hours)}시간 ${String(minutes).padStart(2, "0")}분`;
    }
  };

  const arrayLength = todayPlan?.length;
  return (
    <div className="p-6 rounded-lg border">
      <h3 className="flex items-center gap-2 font-semibold mb-3">
        <Clock4 width={16} height={16} />
        오늘의 타임라인
      </h3>

      {/* 값 없을 시 */}
      {todayPlan?.length === 0 ? (
        <div className="py-5">
          <div className="flex flex-col justify-center">
            <div className="w-14 h-14 p-3 bg-gray-100 rounded-full mx-auto mb-3">
              <Calendar width={32} height={32} />
            </div>
            <p className="mb-1 text-center text-gray-700 font-medium">
              오늘 일정이 없습니다.
            </p>
            <p className="text-sm text-gray-500 mb-4 text-center">
              새로운 일정을 추가하여 하루를 계획해보세요. <br /> 효율적인 시간
              관리의 첫 걸음입니다.
            </p>
            <div className="flex flex-wrap gap-2 justify-center ">
              <Link href="/schedule">
                <button className="gap-1 flex items-center px-4 py-2 text-sm bg-black text-white rounded">
                  <Plus width={16} height={16} color="white" />
                  일정 추가하기
                </button>
              </Link>
              <Link href="/schedule/repeat">
                <button className="gap-1 flex items-center  px-4 py-2 text-sm border rounded">
                  <Calendar width={16} height={16} />
                  반복 일정 설정
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // 값 있을때
        <div className="flex flex-col gap-4">
          {todayPlan?.map((plan, index) => {
            const { id, color, label, start_time, end_time, is_important } =
              plan;

            const now = dayjs(`2000-01-01T${dayjs().format("HH:mm")}`);
            const start = dayjs(`2000-01-01T${start_time}`);
            const end = dayjs(`2000-01-01T${end_time}`);

            return (
              <div className="flex" key={id}>
                <div className="flex flex-col  justify-start items-center">
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-md min-w-[50px] text-center ${
                      now.isAfter(start)
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {start_time?.slice(0, 5)}
                  </div>
                  {arrayLength !== index + 1 && (
                    <div className="w-[1px] h-8 bg-border mt-2 ml-6"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="w-full flex items-center">
                    {/* dayjs 객체 비교위해 무의미 2000-01-01 사용  */}
                    {now?.isAfter(start) ? (
                      <CircleCheck
                        className="text-green-400"
                        width={16}
                        height={16}
                      />
                    ) : (
                      <Circle width={16} height={16} />
                    )}
                    <div
                      className="w-2 h-2 rounded-full ml-2"
                      style={{ backgroundColor: color }}
                    />
                    <p
                      className={`max-w-[175px] ml-2 text-sm font-medium truncate flex-1  ${
                        now?.isAfter(end) ? "line-through" : ""
                      }`}
                    >
                      {label}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {getDiffTime(start_time, end_time)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
