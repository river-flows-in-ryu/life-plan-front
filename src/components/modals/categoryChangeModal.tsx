"use client";

import React, { useEffect } from "react";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import CloseImg from "../../../public/close.png";

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
  const category = searchParams.get("category");

  const { start_time, end_time, color, date, label } = plan[0];

  return (
    <div className="w-[90%] h-[300px] p-6 sm:w-[450px] sm:h-[300px] sm:p-8  bg-white rounded  relative">
      <button onClick={onClose} className="absolute right-4">
        <Image src={CloseImg} alt="" width={16} height={16} />
      </button>
      <h1>카테고리 변경</h1>
      <p>선택한 활동의 카테고리를 변경합니다.</p>
      <div className="p-4 bg-[#F9FAFB]">
        <p className="font-bold">{label}</p>
        <span>
          {date} {start_time} - {end_time}
        </span>
        <div className=""> 현재 : {category}</div>
      </div>
      <p>변경할 카테고리 선택:</p>
    </div>
  );
}
