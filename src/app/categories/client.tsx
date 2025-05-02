"use client";

import React, { memo, useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Modal from "@/components/modal";
import CategoryChangeModal from "@/components/modals/categoryChangeModal";

import editImg from "../../../public/edit.png";
import searchImg from "../../../public/searchImg.png";
import closeImg from "../../../public/close.png";

dayjs.extend(customParseFormat);

interface Category {
  id: number;
  name: string;
}

interface Props {
  categoryData: Category[];
}

interface Plan {
  color: string;
  date: string;
  description: string;
  end_time: string;
  id: number;
  is_important: boolean;
  label: string;
  start_time: string;
  user: number;
}

export default function Client({ categoryData }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const urlPeriod = searchParams.get("period") || "week";

  const [periodType, setPeriodType] = useState(urlPeriod);

  const [categoryPlans, setCategoryPlans] = useState<Plan[]>([]);

  const [totalMinutes, setTotalMinutes] = useState<number>(0);

  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPlanId, setSeletedPlanId] = useState<number | null>(null);

  const { data: session } = useSession();

  const router = useRouter();

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const categoryValue = category ? encodeURIComponent(category) : "";

  useEffect(() => {
    const period = searchParams.get("period");
    if (period === "week" || period === "month" || period === "custom") {
      setPeriodType(period);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!session) return;

    const handleFetchData = async () => {
      const startDate = date?.from ? format(date?.from, "yyyy-MM-dd") : "";
      const endDate = date?.to ? format(date?.to, "yyyy-MM-dd") : "";

      if (periodType === "custom" && (!date?.from || !date?.to)) {
        setCategoryPlans([]);
        return;
      }
      let url = `plans?category=${categoryValue}&period=${periodType}`;

      if (periodType === "custom") url += `&start=${startDate}&end=${endDate}`;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });
        const resJson = await res.json();
        setCategoryPlans(resJson?.data);
        setTotalMinutes(resJson?.total_minutes);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        setCategoryPlans([]);
      }
    };

    handleFetchData();
  }, [category, periodType, session, date]);

  const handlePeriodChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", type); // 기존 값 유지하면서 period만 변경
    router.push(`/categories?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", newCategory);
    router.push(`/categories?${params.toString()}`);
  };

  const handleClickPlan = (id: number) => {
    setIsModalOpen(true);
    setSeletedPlanId(id);
  };

  const handleClickChangeCategory = () => {
    let url = `/categories/change?category=${encodeURIComponent(
      categoryValue
    )}&period=${periodType}`;
    if (periodType === "custom" && date?.from && date?.to) {
      const start = dayjs(date.from).format("YYYY-MM-DD");
      const end = dayjs(date.to).format("YYYY-MM-DD");

      url += `&start=${start}&end=${end}`;
    }

    router.push(url);
  };

  const HeaderSection = () => {
    return (
      <div className="sm:flex sm:justify-between mb-0 sm:mb-6 ">
        <h1 className="font-bold text-2xl mb-4 sm:mb-0">{category} 카테고리</h1>
        <div className="h-10 p-1 sm:w-[400px] w-full flex bg-[#f3f4f6] sm:mb-0 mb-6">
          {["week", "month", "custom"].map((type) => (
            <button
              key={type}
              className={`w-1/3 ${
                periodType === type ? "bg-white font-bold" : ""
              }`}
              onClick={() => handlePeriodChange(type)}
            >
              {type === "week" && "주간"}
              {type === "month" && "월간"}
              {type === "custom" && "사용자지정"}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const StatsWithCategoryToggle = () => {
    let changePageUrl = `/categories/change?category=${encodeURIComponent(
      categoryValue
    )}&period=${periodType}`;
    return (
      <div className="w-full sm:flex sm:justify-evenly gap-6 mb-6">
        <div className="w-full sm:w-2/3 p-4 flex items-center justify-between border border-[#e5e7eb] rounded sm:mb-0 mb-6">
          <div className="flex justify-around sm:justify-evenly gap-0 sm:gap-8 w-full">
            <div className="text-center">
              <span className="text-sm">총 활동 수</span>
              <p className="text-xl font-bold">
                {categoryPlans?.length || 0}개
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm">총 소요 시간</span>
              <p className="text-xl font-bold">
                {hours || 0}시간 {minutes || 0}분
              </p>
            </div>
          </div>

          <button
            className="h-10 w-[130px] bg-black text-white rounded text-sm px-4 py-2 hidden sm:inline-block font-medium"
            onClick={handleClickChangeCategory}
          >
            카테고리 변경
          </button>
        </div>
        <div className="w-full sm:w-1/3 p-4 border border-[#e5e7eb] rounded mb-6 sm:mb-0">
          <p className="mb-2 font-bold">다른 카테고리 보기</p>
          <div className="flex flex-wrap gap-2">
            {categoryData?.map((data) => {
              const { id, name } = data;
              return (
                <button
                  key={id}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    category === name
                      ? "bg-black text-white"
                      : " bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryChange(name)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const CategoryItemList = memo(() => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlans = useMemo(() => {
      if (!searchTerm) return categoryPlans;
      return categoryPlans?.filter((plan) =>
        plan.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [searchTerm, categoryPlans]);

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className=" w-full flex flex-col sm:flex-row gap-2.5 sm:gap-0 justify-between">
            <h2 className="text-lg font-bold flex items-center">활동 내역</h2>
            <div className="w-full max-w-xs  border border-[#e5e7eb] h-10 rounded relative p-1 ">
              <Image
                className="absolute top-1/2 left-3 transform -translate-y-1/2"
                src={searchImg}
                width={16}
                height={16}
                alt="flaction_search_img"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event?.target?.value)}
                type="text"
                className="pl-10 h-8 w-full "
                placeholder="일정 검색..."
              />

              {searchTerm !== "" && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <Image
                    className=""
                    src={closeImg}
                    alt="flaction_close_img"
                    width={16}
                    height={16}
                  />
                </button>
              )}
            </div>
          </div>
          <button
            className="h-10 w-[130px] bg-black text-white rounded text-sm px-4 py-2 inline-block sm:hidden font-medium"
            onClick={handleClickChangeCategory}
          >
            카테고리 변경
          </button>
        </div>
        <div
          className={`flex flex-col items-center ${
            filteredPlans?.length !== 0
              ? "grid grid-cols-1 sm:grid-cols-3 gap-3 flex-col items-start"
              : ""
          }`}
        >
          {!date && periodType === "custom" ? (
            <div className="text-center w-full py-10">
              <h3 className="text-lg font-medium mb-2">날짜를 선택해주세요</h3>
              <p className="text-gray-500">
                활동 내역을 확인하려면 날짜가 필요해요.
              </p>
            </div>
          ) : filteredPlans?.length !== 0 ? (
            <>
              {filteredPlans &&
                filteredPlans?.map((plan) => {
                  const { id, label, date, start_time, end_time, description } =
                    plan;

                  const start = dayjs(start_time, "HH:mm:ss");
                  const end = dayjs(end_time, "HH:mm:ss");
                  const diffMinutes = end.diff(start, "minute");

                  const hours = Math.floor(diffMinutes / 60);
                  const minutes = diffMinutes % 60;

                  const durationStr =
                    hours && minutes
                      ? `${hours}시간 ${minutes}분`
                      : hours
                      ? `${hours}시간`
                      : `${minutes}분`;
                  return (
                    <div
                      key={id}
                      className="p-4 border border-[#e5e7eb] rounded"
                    >
                      <div className="flex justify-between">
                        <p className="mb-1 font-medium truncate">{label}</p>
                        <button
                          className="p-1 rounded-[50%] bg-gray-100 hover:bg-gray-200 w-8 h-8 "
                          onClick={() => handleClickPlan(id)}
                        >
                          <Image
                            className="m-auto"
                            src={editImg}
                            alt="flaction_edit_img"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                      <span className="max-w-[100%] block text-sm truncate">
                        {description}
                      </span>
                      <span className="text-sm">
                        {date} &nbsp;
                        {start.format("HH:mm")} - {end.format("HH:mm")} (
                        {durationStr})
                      </span>
                    </div>
                  );
                })}
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium mb-2">
                이 카테고리에 활동 내역이 없습니다
              </h3>
              <p className="text-gray-500 mb-6 text-center">
                선택한 기간(
                {periodType === "weekly"
                  ? "주간"
                  : periodType === "monthly"
                  ? "월간"
                  : "사용자 지정"}
                ) 동안 &nbsp;
                <br className="inline-block sm:hidden" />
                {category} 카테고리에 기록된 활동이 없습니다.
              </p>

              <div className="grid gap-4 w-full max-w-md">
                <Link href="/schedule">
                  <button className="w-full">
                    <div className="mr-2 h-4 w-4" />새 활동 추가하기
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </>
    );
  });

  return (
    <div className="w-full h-full p-4 ">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CategoryChangeModal
          onClose={() => setIsModalOpen(false)}
          id={selectedPlanId}
          plan={categoryPlans?.filter((p) => p.id === selectedPlanId)}
          categoryData={categoryData}
        />
      </Modal>
      <HeaderSection />
      <div
        className={`p-6 border border-[#e5e7eb] w-full mb-4 ${
          periodType === "custom" ? "inline-block" : "hidden"
        }`}
      >
        <div className="flex justify-between">
          <h3 className="mb-5 text-md font-semibold">기간 선택</h3>
          <span className="text-sm text-red-500">
            * 종료일까지 선택해주세요
          </span>
        </div>
        <div className="mb-4">
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
        <span className={`text-sm font-bold ${date?.from ? "" : "invisible"}`}>
          현재 적용된 기간 : &nbsp;
          {date?.from ? format(date?.from, "yyyy-MM-dd") : ""}
          {date?.to ? <>&nbsp;~&nbsp;</> : <></>}
          {date?.to ? format(date?.to, "yyyy-MM-dd") : ""}
        </span>
      </div>

      <StatsWithCategoryToggle />
      <CategoryItemList />
    </div>
  );
}
