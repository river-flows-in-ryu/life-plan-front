"use client";
import React, { useState, useEffect } from "react";

import Calendar from "react-calendar";
import dayjs from "dayjs";
import { HexColorPicker } from "react-colorful";
import html2canvas from "html2canvas";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

import TimeWheel from "@/components/schedule/timeWheel";

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
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [planTitle, setPlanTitle] = useState<string>("");
  const [planDetail, setPlanDetail] = useState<string>("");
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [color, setColor] = useState("#fff");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1);
  const [currendYear, setCurrentYear] = useState(dayjs().year());

  const [scheduleDates, setScheduleDates] = useState<string[]>([]);

  const [holiday, setHoliday] = useState<HolidayType[]>([]);

  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    if (selectedId) {
      const newData = data?.filter((data) => data?.id === selectedId);
      const { startTime, endTime, description, label, color, isImportant } =
        newData[0];
      setStartTime(startTime || "");
      setEndTime(endTime || "");
      setPlanTitle(label);
      setPlanDetail(description);
      setIsImportant(isImportant || false);
      setColor(color);
    }
  }, [selectedId]);

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
    setStartTime("");
    setEndTime("");
    setPlanTitle("");
    setPlanDetail("");
    setColor("#fff");
    setIsImportant(false);
    setSelectedId(null);
    // useColor("#fff");
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

  const handleClickSubmit = async () => {
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/plans/create/`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          label: planTitle,
          description: planDetail,
          is_important: isImportant,
          color: color,
        }),
      }
    );
    const data = await res.json();
    alert(data?.message);
    if (data?.data) {
      const {
        color,
        description,
        end_time,
        label,
        start_time,
        id,
        is_important,
      } = data?.data;
      //정렬해서 넣기
      setData((prev: Plan[]) =>
        [
          ...prev,
          {
            color,
            description,
            label,
            startTime: start_time.slice(0, 5),
            endTime: end_time.slice(0, 5),
            isImportant: is_important,
            id,
          },
        ].sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        })
      );
      cleanData();
    }
  };

  const handleClickUpdate = async () => {
    try {
      if (!selectedId) {
        alert("선택후 수정을 해주세요");
        return;
      }
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${selectedId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: 2,
            date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            label: planTitle,
            description: planDetail,
            is_important: isImportant,
            color: color,
          }),
        }
      );
      const updatedPlan = await res.json();
      const updateData = updatedPlan?.data;

      if (res?.ok) {
        setData((prevPlans) => {
          const index = prevPlans.findIndex((plan) => plan.id === selectedId);

          if (index === -1) {
            console.error("Plan not found for update");
            return prevPlans;
          }

          const updateDatas = [
            ...prevPlans.slice(0, index),
            {
              color: updateData?.color,
              description: updateData?.description,
              label: updateData?.label,
              startTime: updateData?.start_time.slice(0, 5),
              endTime: updateData?.end_time.slice(0, 5),
              isImportant: updateData?.is_important,
              id: updateData?.id,
            },
            ...prevPlans.slice(index + 1),
          ];

          return updateDatas;
        });
        alert("수정이 완료되었습니다.");
      } else {
        alert(updatedPlan?.message);
      }
      //todo
    } catch (error: any) {
      console.log("Error:", error.message);
    }
  };

  const handleClickDelete = async () => {
    if (window.confirm("이 일정을 삭제하시겠습니까?")) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${selectedId}/delete/`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await res.json();
      if (jsonData?.message === "SUCCESS") {
        alert("성공적으로 삭제되었습니다.");
        const newData = data?.filter((data) => data?.id !== selectedId);
        setData(newData);
        cleanData();
      } else {
        alert("실패입니다. 다시 시도해주세요");
      }
    }
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
          <span className="red-dot" />
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
    <div className="">
      <Link href="/schedule-report">
        <button>리포트 보러가기</button>
      </Link>
      <div className="flex flex-col sm:flex-row bg-[#f3f4f6] p-4 gap-4 ">
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
            <ul className="pl-5 mt-5">
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

        <div className="border border-[#e5e7eb] rounded-2xl bg-white w-full sm:w-[330px] p-4">
          <h3 className=" text-2xl	font-bold">Schedule Details</h3>
          <div className="mt-6">
            <label className="block">시작시간</label>
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
          <div className="mt-4">
            <label className="block">종료시간</label>
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
          <div className="mt-4">
            <label className="block">일정제목</label>
            <input
              className="border border-[#e5e7eb] w-full h-10 pl-2"
              type="text"
              onChange={(event) => setPlanTitle(event?.target.value)}
              value={planTitle}
            />
          </div>
          <div className="mt-4 ">
            <label className="block">일정상세</label>
            <textarea
              className="border border-[#e5e7eb] w-full h-[60px] pl-2 pt-1"
              onChange={(event) => setPlanDetail(event?.target.value)}
              value={planDetail}
            />
          </div>

          <div className="flex items-center space-x-2 ">
            <Checkbox
              id="terms"
              checked={isImportant}
              onCheckedChange={() =>
                setIsImportant((isImportant) => !isImportant)
              }
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              주요 일정
            </label>
          </div>

          <div className="mt-6">
            <HexColorPicker
              color={color}
              onChange={setColor}
              style={{ margin: "auto" }}
            />
          </div>

          <div className="flex gap-2 my-2.5 justify-center">
            {!selectedId && (
              <button
                className="bg-[#2564eb] w-full h-10 rounded text-white"
                onClick={handleClickSubmit}
              >
                Add
              </button>
            )}
            {selectedId && (
              <>
                <button
                  className="bg-[#eab208] w-full h-10 rounded text-white"
                  onClick={handleClickUpdate}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 w-full h-10 rounded text-white"
                  onClick={handleClickDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
          <button
            className="bg-black text-white w-full h-10 rounded"
            onClick={cleanData}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
