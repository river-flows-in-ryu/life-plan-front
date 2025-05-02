import React from "react";

type DayCategory = "weekdays" | "weekend" | "custom";

interface Props {
  dayCategory: string;
  setDayCategory: (value: DayCategory) => void;
  selectedWeekdays: string[];
  handleClickToggleDays: (day: string) => void;
}

export default function WeekdayPatternSelector({
  dayCategory,
  setDayCategory,
  selectedWeekdays,
  handleClickToggleDays,
}: Props) {
  const dayCategoryList: DayCategory[] = ["weekdays", "weekend", "custom"];

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

  return (
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
                  isSelected ? "bg-black text-white border-none" : "border"
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
  );
}
