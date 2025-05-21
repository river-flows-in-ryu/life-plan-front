import React from "react";

import Image from "next/image";

import type { StaticImageData } from "next/image";

import lock from "../../../public/badge/lock.png";
import hobby from "../../../public/badge/hobbies.png";
import exercise from "../../../public/badge/exercise.png";
import rest from "../../../public/badge/rest.png";
import work from "../../../public/badge/work.png";
import book from "../../../public/badge/book.png";
import commute from "../../../public/badge/commute.png";
import selfCare from "../../../public/badge/self-care.png";
import eating from "../../../public/badge/eating.png";
import check_green from "../../../public/check_green.png";

interface Props {
  badgeData: {
    achieved: boolean;
    description: string;
    id: number;
    image: string;
    name: string;
    category: number;
  }[];
}

const BADGE_IMAGE_MAP: Record<number, StaticImageData> = {
  1: exercise,
  2: rest,
  3: work,
  4: eating,
  5: book,
  6: commute,
  7: selfCare,
  8: hobby,
};

export default function BadgeDashboard({ badgeData }: Props) {
  return (
    <div className=" border rounded mt-6">
      <div className="px-6 pt-6 pb-3">
        <h3 className="text-2xl font-semibold ">내 뱃지</h3>
        <span className="block mt-1.5">
          목표 달성으로 획득한 뱃지를 확인하세요
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          {badgeData?.map((badge) => {
            const { achieved, description, id, image, name, category } = badge;
            return (
              <div
                key={id}
                className={`rounded-xl border-2 ${
                  achieved ? "border-green-300 bg-green-50" : "border-gray-200"
                }`}
              >
                <div className="p-4 text-center">
                  <div className="relative">
                    <div
                      className={`w-[64px] h-[64px] mx-auto rounded-full flex items-center justify-center ${
                        achieved ? " bg-white border" : "bg-gray-200"
                      } `}
                    >
                      <Image
                        src={achieved ? BADGE_IMAGE_MAP[category] : lock}
                        alt="lock_flaction_img"
                        width={24}
                        height={24}
                      />
                    </div>
                    {achieved && (
                      <Image
                        src={check_green}
                        alt="check_green_flaction"
                        className="absolute top-0 right-0"
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                  <h3 className="mt-2 font-medium text-sm">{name}</h3>
                  <p className="text-xs mt-1 text-gray-500">
                    {achieved ? description : "아직 획득하지 못했습니다"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
