import React from "react";

import { Pie } from "react-chartjs-2";

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
    //
    <Pie data={weeklyData} />
  );
}
