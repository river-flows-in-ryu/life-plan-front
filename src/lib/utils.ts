import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPeriodDateRanges = (
  periodType: "week" | "month",
  periodPosition: "current" | "next"
) => {
  const today = dayjs();

  dayjs.extend(isoWeek);

  if (periodType === "week") {
    const currentStart = today.startOf("isoWeek");
    const start =
      periodPosition === "current" ? currentStart : currentStart.add(1, "week");
    const end = start.endOf("isoWeek");
    return `${start.format("YYYY.MM.DD")} ~ ${end.format("YYYY.MM.DD")}`;
  }

  if (periodType === "month") {
    const currentStart = today.startOf("month");
    const start =
      periodPosition === "current"
        ? currentStart
        : currentStart.add(1, "month");
    const end = start.endOf("month");
    return `${start.format("YYYY.MM.DD")} ~ ${end.format("YYYY.MM.DD")}`;
  }
  return null;
};
