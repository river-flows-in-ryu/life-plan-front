"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import closeImg from "../../../public/close.png";
import checkMarkImg from "../../../public/check-mark.png";

interface Props {
  onClose: () => void;
  id: number | null;
  plan: Plan[];
  categoryData: categoryType[];
}
interface categoryType {
  id: number;
  name: string;
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

export default function CategoryChangeModal({
  onClose,
  id,
  plan,
  categoryData,
}: Props) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const { start_time, end_time, color, date, label } = plan[0];

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const filterCategoryData = categoryData?.filter((category) => {
    return category?.name !== currentCategory;
  });

  const handleSubmitChangeCategory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/plans/${id}/category/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: selectedCategoryId }),
        }
      );
      if (res.ok) {
        onClose();
        location.reload();
        alert("성공적으로 변경되었습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-[90%] h-fit p-6 sm:w-[450px] sm:h-[600px]  sm:p-8  bg-white rounded  relative">
      <button onClick={onClose} className="absolute right-4">
        <Image src={closeImg} alt="flaction_close_img" width={16} height={16} />
      </button>
      <h1 className="text-lg font-bold">카테고리 변경</h1>
      <p className="mt-1.5 text-sm mb-8">
        선택한 활동의 카테고리를 변경합니다.
      </p>
      <div className="p-4 bg-[#F9FAFB] mb-6">
        <p className="font-bold text-lg mb-2">{label}</p>
        <span className="text-sm">
          {date} {start_time} - {end_time}
        </span>
        <div className="w-fit mt-1 px-2.5 py-0.5 border border-[#F9FAFB rounded-full text-xs font-semibold">
          현재 : {currentCategory}
        </div>
      </div>
      <p className="font-medium mb-3">변경할 카테고리 선택:</p>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 ">
        {filterCategoryData?.map((category) => {
          const { id, name } = category;
          const isSelected = selectedCategoryId === id;

          return (
            <div
              className={`w-ful border p-3 rounded
               flex justify-between items-center cursor-pointer hover:bg-[#f3f3f4]
               ${isSelected ? "bg-[#f3f3f4] border-black" : "border-[#e5e7eb] "}
               `}
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
                <span className="truncate block max-w-[80px] sm:max-w-[120px] text-sm">
                  {name}
                </span>
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
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="px-4 py-2 h-10 border border-[#e5e7eb] font-semibold rounded"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="px-4 py-2 h-10 bg-black text-white font-semibold rounded"
          onClick={handleSubmitChangeCategory}
        >
          변경 완료
        </button>
      </div>
    </div>
  );
}
