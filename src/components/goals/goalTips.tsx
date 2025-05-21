import React from "react";

export default function GoalTips() {
  return (
    //
    <div className="border rounded p-6">
      <h3 className="font-semibold">목표 달성 팁</h3>
      <div className="flex flex-col mt-6 gap-4">
        <div className="flex text-sm text-[#71717a]">
          <div></div>
          <p>작고 구체적인 목표를 설정하면 달성 확률이 높아집니다.</p>
        </div>
        <div className="flex text-sm text-[#71717a]">
          <div></div>
          <p>매일 조금씩 진행 상황을 업데이트하면 동기부여에 도움이 됩니다.</p>
        </div>
        <div className="flex text-sm text-[#71717a]">
          <div></div>
          <p>뱃지 획득은 목표 달성의 즐거움을 더해줍니다.</p>
        </div>
      </div>
    </div>
  );
}
