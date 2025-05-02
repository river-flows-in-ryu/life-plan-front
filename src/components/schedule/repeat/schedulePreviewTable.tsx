import React from "react";

import Image from "next/image";

import star from "../../../../public/star.png";
import colorStar from "../../../../public/star-color.png";

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

interface Props {
  sampleData: SampleData[];
}

export default function SchedulePreviewTable({ sampleData }: Props) {
  const weekdayKoreanMap = {
    monday: "월요일",
    tuesday: "화요일",
    wednesday: "수요일",
    thursday: "목요일",
    friday: "금요일",
    saturday: "토요일",
    sunday: "일요일",
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between mb-3">
        <p className="font-semibold">생성된 일정 미리보기</p>
        <div className="border rounded-full px-2 py-0.5 text-xs font-semibold">
          총 {sampleData?.length || 0}개
        </div>
      </div>
      <div className="sm:hidden max-h-[300px] overflow-y-auto border rounded p-2 flex flex-col gap-1">
        {sampleData?.length !== 0 ? (
          <>
            {sampleData?.map((sample) => {
              const {
                dayOfTheWeek,
                day,
                endTime,
                isImportant,
                startTime,
                title,
              } = sample;
              return (
                <div className="p-3 border rounded">
                  <div className="flex items-center mb-1">
                    <p className="font-medium truncate flex-1">{title}</p>
                    {isImportant && (
                      <Image
                        src={colorStar}
                        alt="flaction_star"
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                  <span className="block text-sm text-gray-500">
                    {day} ({weekdayKoreanMap[dayOfTheWeek]})
                  </span>
                  <span className="block text-sm text-gray-500">
                    {startTime} ~ {endTime}
                  </span>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex justify-center items-center h-20 text-gray-400">
            데이터가 없습니다.
          </div>
        )}
      </div>
      <div className="hidden sm:block border rounded">
        <div className="max-h-[200px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 h-10 bg-gray-100 border-b">
              <tr>
                <th>날짜</th>
                <th>요일</th>
                <th>시간</th>
                <th>제목</th>
                <th>중요</th>
              </tr>
            </thead>
            <tbody>
              {sampleData?.length !== 0 ? (
                <>
                  {sampleData?.map((sample) => {
                    const {
                      dayOfTheWeek,
                      day,
                      endTime,
                      isImportant,
                      startTime,
                      title,
                    } = sample;
                    return (
                      <tr
                        key={`${day}-${dayOfTheWeek}`}
                        className="text-center border-t h-[45px]"
                      >
                        <td>{day}</td>
                        <td>{weekdayKoreanMap[dayOfTheWeek]}</td>
                        <td>
                          {startTime} ~ {endTime}
                        </td>
                        <td>{title}</td>
                        <td className="text-center align-middle">
                          <div className="flex justify-center items-center h-10">
                            <Image
                              src={isImportant ? colorStar : star}
                              alt="flaction_star_img"
                              className="w-5 h-5"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex justify-center items-center h-20 text-gray-400">
                      데이터가 없습니다.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
