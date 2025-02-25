import dayjs from "dayjs";
import React from "react";

import { Plan } from "@/types/plan";

interface Props {
  data: Plan[];
  periodType: string;
  when?: "current" | "next";
}

function getSummaryText(periodType: string, when?: "current" | "next") {
  if (periodType === "week") {
    if (when === "current") {
      return "이번주 주요 일정 요약";
    } else if (when === "next") {
      return "다음주 주요 일정 요약";
    }
  } else if (periodType === "month") {
    if (when === "current") {
      return "이번달 주요 일정 요약";
    } else if (when === "next") {
      return "다음달 주요 일정 요약";
    }
  } else if (periodType === "custom") {
    return "사용자 지정 주요 일정 요약";
  }

  return "기간 정보가 잘못되었습니다.";
}

export default function ImportantPlansComponent({
  data,
  periodType,
  when,
}: Props) {
  const dataLength = data?.length;
  return (
    <div
      className="flex-1 border bg-white p-6 max-h-[350px] overflow-auto flex flex-col
    "
    >
      <h3 className="text-xl font-bold mb-5">
        {getSummaryText(periodType, when)}
      </h3>
      {dataLength ? (
        <ul>
          {data?.map((plan: Plan) => {
            const {
              color,
              date,
              description,
              end_time,
              label,
              start_time,
              id,
            } = plan;
            return (
              <div
                key={id}
                className={`border p-3 rounded 
                ${dataLength !== 1 ? "mb-3" : ""} `}
              >
                <span className="font-bold">
                  {date} {dayjs(date).format("dddd")}
                </span>
                <div className="flex">
                  <div></div>
                  <div>
                    <p className="font-bold ">{label}</p>
                    <p className="text-sm">
                      📆 {start_time?.substring(0, 5)} ~{" "}
                      {end_time?.substring(0, 5)}{" "}
                    </p>
                    <span className="text-sm">{description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center items-center h-full font-bold">
          * 중요 일정이 없습니다.
        </div>
      )}
    </div>
  );
}
