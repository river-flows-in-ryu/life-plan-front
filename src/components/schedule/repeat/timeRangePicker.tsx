import React from "react";

export default function TimeRangePicker({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: {
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
}) {
  return (
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
  );
}
