"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";

import {
  fetchCategoryPlans,
  changePlansCategory,
} from "@/queries/categoryPlans";

import checkMarkImg from "../../../../public/check-mark.png";

interface Props {
  categoryData: { id: number; name: string }[];
}

export default function Client({ categoryData }: Props) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  console.log(startDate, endDate);

  const urlPeriod = searchParams.get("period") || "week";

  const [category, setCategory] = useState<string | null>(
    categoryParam ? decodeURIComponent(categoryParam) : null
  );

  const [periodType, setPeriodType] = useState(urlPeriod);

  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [step, setStep] = useState<1 | 2>(1);

  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    const period = searchParams.get("period");
    if (period === "week" || period === "month" || period === "custom") {
      setPeriodType(period);
    }
  }, [searchParams]);

  const { data: categoryPlansData } = useQuery({
    queryKey: ["categoryPlan", session, periodType],
    queryFn: () =>
      fetchCategoryPlans({
        category,
        periodType,
        session,
        ...(periodType === "custom" && startDate && endDate
          ? { start: startDate, end: endDate }
          : {}),
      }),
    enabled: !!session?.user?.accessToken,
  });

  const mutation = useMutation({
    mutationFn: changePlansCategory,
    onSuccess: (data) => {
      alert(data?.message);
      window.location.reload();
    },
  });

  const handlePeriodChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", type);
    router.push(`/categories/change?${params.toString()}`);
  };

  const handleClickCheckAll = () => {
    const ids =
      categoryPlansData?.data?.map((plan: { id: number }) => plan.id) || [];

    const isFullyChecked = checkedItems.length === ids.length;

    if (isFullyChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems([...ids]);
    }
  };

  const handleClickCheckItem = (id: number) => {
    setCheckedItems((prev) =>
      prev?.includes(id) ? prev?.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClickChangePlansCategory = () => {
    if (selectedCategoryId === null || checkedItems?.length === 0) return;

    mutation.mutate({
      plan_ids: checkedItems,
      category_id: selectedCategoryId,
    });
  };

  const categoryLength = categoryPlansData?.data?.length;

  const isAllChecked = checkedItems?.length === categoryLength;

  const filteredCategory = categoryData?.filter(
    (cat) => cat?.name !== category
  );

  const CategoryPlansListComponent = () => {
    return (
      <div className="sm:border-r-[2px] sm:pr-6 pr-0 ">
        <div className="flex gap-2.5 mb-4">
          <h2 className="font-medium ">{category} 카테고리 내역</h2>
          <div className="flex justify-center items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit">
            총 {categoryLength || 0} 개
          </div>
        </div>
        <div className="flex gap-2.5 items-center cursor-pointer mb-4">
          <div
            onClick={handleClickCheckAll}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              checked={isAllChecked}
              readOnly
            />
            <p className="font-medium text-sm ">전체 선택</p>
          </div>
          <div className="w-fit border px-2.5 py-0.5 text-xs font-semibold rounded-full">
            {checkedItems?.length}개 선택됨
          </div>
        </div>
        <div className="flex flex-col min-h-[200px] sm:h-[400px] overflow-y-auto pr-2 gap-3 p-4 border border-[#e5e7eb]">
          {!categoryLength || categoryLength === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>선택한 기간 동안 등록된 일정이 없어요.</p>
            </div>
          ) : (
            categoryPlansData?.data?.map((plan: any) => {
              const {
                id,
                label,
                description,
                date,
                start_time,
                end_time,
                is_important,
              } = plan;
              return (
                <div
                  className="p-3 flex gap-3 border border-[#e5e7eb] rounded-md cursor-pointer"
                  key={id}
                  onClick={() => handleClickCheckItem(id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={checkedItems?.includes(id)}
                      readOnly
                    />
                  </div>
                  <div className=" w-full min-w-0">
                    <p className=" w-full text-sm font-bold truncate">
                      {label}
                    </p>
                    <span className=" w-full text-xs block truncate ">
                      {description}
                    </span>
                    <span className=" block text-xs">
                      {date} / {start_time.slice(0, 5)}분 ~{" "}
                      {end_time.slice(0, 5)}분
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const CategoryListComponent = () => {
    return (
      <div className="">
        <h2 className="font-medium mb-2">현재 카테고리 : {category} </h2>
        <span className="text-sm text-gray-500">
          변경할 카테고리를 선택하세요
        </span>
        <div className="grid grid-cols-1 gap-3 mt-6">
          {filteredCategory?.map((category) => {
            const { id, name } = category;
            const isSelected = id === selectedCategoryId;
            return (
              <div
                className={`flex justify-between items-center p-3 cursor-pointer border border-[#e5e7eb] rounded hover:bg-[#f3f3f4]
               ${
                 isSelected ? "bg-[#f3f3f4] border-black" : "border-[#e5e7eb] "
               }`}
                key={id}
                onClick={() => setSelectedCategoryId(id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={isSelected}
                    onChange={() => setSelectedCategoryId(id)}
                    className="mr-3 appearance-none w-3 h-3  border-[1px] rounded-full cursor-pointer outline-none  checked:bg-black checked:border-white checked:border-[2px] shadow-[0_0_0_1.5px_black]"
                  />
                  <span className="text-sm">{name}</span>
                </div>
                {isSelected && (
                  <Image
                    className="w-4 h-4"
                    src={checkMarkImg}
                    alt="flaction_check_img"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 ">
      <div className="mx-auto">
        <div className="p-6 ">
          <h1 className="text-xl font-semibold">카테고리 일괄 변경</h1>

          <span className="text-sm block sm:hidden">
            변경할 일정을 선택해주세요.
          </span>
          <span className="text-sm hidden sm:block">
            좌측에서 활동을 선택하고, 우측에서 변경할 카테고리를 선택하세요.
          </span>
        </div>
        <div className="bg-gray-50 h-10 sm:h-[60px] mb-5 flex justify-center items-center rounded">
          <p>
            {periodType === "custom"
              ? "사용자 지정 기간 일정 내역"
              : periodType === "week"
              ? "이번 주 일정 내역"
              : "이번 달 일정 내역"}
          </p>
        </div>
        <div className=""></div>
        <div className="p-6 border border-[#e5e7eb] rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:hidden">
              {step === 1 && <CategoryPlansListComponent />}
              {step === 2 && <CategoryListComponent />}
            </div>

            {/* PC: 항상 보여줌 */}
            <div className="hidden sm:block">
              <CategoryPlansListComponent />
            </div>
            <div className="hidden sm:block">
              <CategoryListComponent />
            </div>
          </div>
          <div className="items-center p-0 sm:p-6 flex justify-end mt-6">
            {step === 1 && (
              <button
                className="px-4 py-2 text-sm font-medium border sm:hidden"
                onClick={() => setStep(2)}
                disabled={checkedItems.length === 0}
              >
                다음 단계
              </button>
            )}
            {step === 2 && (
              <div className="w-full flex gap-2 justify-end">
                <button onClick={() => setStep(1)} className="border px-4 py-2">
                  이전
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium border sm:hidden"
                  onClick={handleClickChangePlansCategory}
                  disabled={selectedCategoryId === null}
                >
                  변경하기 ({checkedItems.length}개 일정)
                </button>
              </div>
            )}

            <button
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium border"
              onClick={handleClickChangePlansCategory}
            >
              변경하기 ({checkedItems?.length || 0}개 일정)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
