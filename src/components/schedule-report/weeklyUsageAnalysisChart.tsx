import React from "react";

import { Pie } from "react-chartjs-2";
import Image from "next/image";

import pieChart from "../../../public/pie-chart.png";
interface Props {
  total_minutes: number;
  data: PropsData[];
}
interface PropsData {
  category__name: string;
  total_time: number;
}

export default function WeeklyUsageAnalysisChart({
  data,
}: {
  data: Props | null;
}) {
  const weeklyData = {
    labels: data?.data?.map((item) => item?.category__name),
    datasets: [
      {
        data: data?.data?.map((item) => item?.total_time),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(55, 99, 132, 0.2)",
          "rgba(4, 162, 235, 0.2)",
          "rgba(25, 206, 86, 0.2)",
          "rgba(7, 192, 192, 0.2)",
          "rgba(15, 102, 255, 0.2)",
          "rgba(25, 159, 64, 0.2)",
          "rgba(200, 120, 164, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(55, 99, 132, 0.2)",
          "rgba(4, 162, 235, 0.2)",
          "rgba(25, 206, 86, 0.2)",
          "rgba(7, 192, 192, 0.2)",
          "rgba(15, 102, 255, 0.2)",
          "rgba(25, 159, 64, 0.2)",
          "rgba(200, 120, 164, 0.2)",
        ],
      },
    ],
  };
  return (
    <>
      {data?.data?.length !== 0 ? (
        <Pie data={weeklyData} />
      ) : (
        <div className="flex flex-col justify-center items-center pt-10 pb-0 sm:pb-10 gap-3 ">
          <div className="w-[56px] h-[56px] bg-gray-100 rounded-full flex justify-center items-center">
            <Image
              src={pieChart}
              alt="flaction_donut_img"
              width={32}
              height={32}
            />
          </div>
          <span>데이터가 없습니다.</span>
        </div>
      )}
    </>
  );
}
