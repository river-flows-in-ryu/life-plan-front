import React from "react";

import Image from "next/image";

import trophy from "../../../public/trophy.png";

interface Props {
  badgeCount: number;
  activeGoals: number;
}

export default function GoalPageHeader({ badgeCount, activeGoals }: Props) {
  return (
    <div className="flex justify-between flex-col sm:flex-row gap-4 sm:gap-0 mb-6">
      <div>
        <h1 className="text-2xl font-bold">목표 관리</h1>
        <p>목표를 설정하고 달성하여 뱃지를 획득하세요</p>
      </div>
      <div className=" flex gap-2 items-center">
        <div className="flex gap-3 px-2.5 py-1 rounded-full border font-semibold text-sm h-fit items-center">
          <Image src={trophy} alt="flaction_trophy_img" className="w-3 h-3 " />
          <span>획득한 뱃지 : {badgeCount || 0} 개</span>
        </div>
        <div className="px-2.5 py-1 rounded-full border font-semibold text-sm h-fit">
          활성 목표 : {activeGoals || 0}개
        </div>
      </div>
    </div>
  );
}
