import React from "react";

import Image from "next/image";

import check from "../../../public/check-mark.png";

interface Props {
  setGoalStatus: (value: "ongoing" | "completed") => void;
}

export default function EmptyCompletedGoal({ setGoalStatus }: Props) {
  return (
    <div className="flex flex-col justify-center">
      <div className="mx-auto mb-6">
        <div className="w-[120px] h-[120px] rounded-full flex justify-center items-center bg-green-50 ">
          <Image src={check} alt="target_flaction_img" width={64} height={64} />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">종료된 목표가 없습니다.</h3>
      <p className="text-gray-500">목표가 종료되면 이곳에 표시됩니다.</p>
      <p className="mb-8 text-gray-500">목표를 달성하고 뱃지를 획득해보세요</p>
      <button
        className="py-2 px-4 w-fit border rounded text-sm font-medium mx-auto"
        onClick={() => setGoalStatus("ongoing")}
      >
        진행 중인 목표 보기
      </button>
    </div>
  );
}
