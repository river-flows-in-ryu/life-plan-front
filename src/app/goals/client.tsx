"use client";

import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import GoalPageHeader from "@/components/goals/goalPageHeader";
import GoalTips from "@/components/goals/goalTips";
import GoalInputSection from "@/components/goals/goalInputSection";

import Pagination from "@/utils/pagination";
import GoalCard from "@/components/goals/goalCard";
import BadgeDashboard from "@/components/goals/badgeDashboard";

import { Goals } from "@/types/goal";

interface Props {
  categoryData: { id: number; name: string }[];
  goalsData: {
    results: Goals[];
    count: {
      ongoing: number;
      completed: number;
    };
  };
  badgeData: {
    badges: {
      achieved: boolean;
      description: string;
      id: number;
      image: string;
      name: string;
      category: number;
    }[];
    count: number;
  };
}

export default function Client({ categoryData, goalsData, badgeData }: Props) {
  const [goalStatus, setGoalStatus] = useState<"ongoing" | "completed">(
    "ongoing"
  );

  const [data, setData] = useState<Goals[]>(goalsData?.results);

  const [page, setPage] = useState(1);

  const { data: session } = useSession();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        if (session) {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/goals?state=${goalStatus}&limit=6&offset=${(page - 1) * 6}`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.accessToken}`,
              },
            }
          );
          if (res.ok) {
            const resJson = await res.json();
            setData(resJson?.results);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleFetch();
  }, [session, goalStatus, page, setPage]);

  const handleClickDelete = async (id: number) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/${id}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.ok) {
        alert("성공적으로 삭제되었습니다.");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const badgeCount = badgeData?.count || 0;
  const activeGoals = goalsData?.count?.ongoing || 0;
  const completedCount = goalsData?.count?.completed || 0;

  return (
    <div className="py-8 px-4">
      <GoalPageHeader badgeCount={badgeCount} activeGoals={activeGoals} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 flex flex-col gap-6">
          <div className="border rounded">
            <div className="">
              <div className="px-6 pt-6 pb-3">
                <h3 className="text-2xl font-semibold">내 목표</h3>
                <p className="text-sm mt-1">
                  설정한 목표와 진행 상황을 확인하세요
                </p>
              </div>
            </div>
            <div className="px-6 mb-4">
              <div className="h-10 items-center justify-center p-1 bg-[#f3f4f6]">
                <button
                  className={`w-1/2 h-full text-sm font-medium ${
                    goalStatus === "ongoing" ? "bg-white" : "text-gray-500"
                  }`}
                  onClick={() => setGoalStatus("ongoing")}
                >
                  진행 중 ({activeGoals || 0})
                </button>
                <button
                  className={`w-1/2 h-full text-sm font-medium ${
                    goalStatus === "completed" ? "bg-white" : "text-gray-500"
                  }`}
                  onClick={() => setGoalStatus("completed")}
                >
                  종료 ({completedCount || 0})
                </button>
              </div>
              <GoalCard
                data={data}
                handleClickDelete={handleClickDelete}
                goalStatus={goalStatus}
                setGoalStatus={setGoalStatus}
              />
            </div>
            <div className="pb-6">
              <Pagination
                total={
                  goalStatus === "ongoing"
                    ? goalsData?.count?.ongoing
                    : goalsData?.count?.completed
                }
                pageSize={6}
                currentPage={page}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <GoalInputSection categoryData={categoryData} />
          <GoalTips />
        </div>
      </div>
      {/* TODO */}
      <BadgeDashboard badgeData={badgeData?.badges} />
    </div>
  );
}
