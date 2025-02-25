import React, { useEffect, useState } from "react";

import { Plan } from "@/types/plan";

const TimeWheel: React.FC<{
  plans: Plan[];
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ plans, setSelectedId }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius / 2;

  const convert24HourRange = (start: string, end: string): [number, number] => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let startMinutes = startHour * 60 + startMinute;
    let endMinutes = endHour * 60 + endMinute;

    // 종료 시간이 시작 시간보다 작은 경우 (다음 날로 넘어가는 경우)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // 24시간을 더해줍니다.
    }

    return [startMinutes, endMinutes];
  };

  const getMarkerStyle = (i: number) => {
    if (i % 6 === 0) {
      return { width: 0, length: 0, opacity: 0 };
    } else if (i % 3 === 0) {
      return { width: 2, length: 10, opacity: 0.8 };
    } else {
      return { width: 1, length: 5, opacity: 0.6 };
    }
  };

  return (
    <div className="w-full">
      <svg width={size} height={size} className="sm:mx-6 m-auto">
        {/* Outer Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#cecece"
          strokeWidth="2"
        />

        {/* Inner Circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#cecece"
          strokeWidth="2"
        />

        {/* Hour Markers */}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = ((i / 24) * 360 - 90) * (Math.PI / 180);
          const style = getMarkerStyle(i);

          if (i % 6 === 0) return null;

          return (
            <line
              key={i}
              x1={center + radius * Math.cos(angle)}
              y1={center + radius * Math.sin(angle)}
              x2={center + (radius + style.length) * Math.cos(angle)}
              y2={center + (radius + style.length) * Math.sin(angle)}
              stroke="#666"
              strokeWidth={style.width}
              opacity={style.opacity}
            />
          );
        })}

        {/* 6-Hour Labels */}
        {Array.from({ length: 24 }, (_, i) => {
          if (i % 6 === 0) {
            const angle = ((i / 24) * 360 - 90) * (Math.PI / 180);
            const textAngle = angle * (180 / Math.PI);
            const x = center + (radius + 15) * Math.cos(angle);
            const y = center + (radius + 15) * Math.sin(angle);
            const displayTime = `${i % 24 === 0 ? 24 : i % 24}`;

            // const rotationAngle =
            //   angle * (180 / Math.PI) + (i === 6 || i === 18 ? 0 : 180);

            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="12"
                transform={`rotate(0, ${x}, ${y})`}
                fill="#333"
                className="font-bold"
              >
                {displayTime}
              </text>
            );
          }
          return null;
        })}

        {/* Time Blocks */}
        {plans.map((plan, idx) => {
          const [startMinutes, endMinutes] = convert24HourRange(
            plan?.startTime || "",
            plan?.endTime || ""
          );

          const startAngle =
            ((startMinutes % (24 * 60)) / (24 * 60)) * 360 - 90;
          const endAngle = ((endMinutes % (24 * 60)) / (24 * 60)) * 360 - 90;

          const start = {
            x: center + radius * Math.cos((startAngle * Math.PI) / 180),
            y: center + radius * Math.sin((startAngle * Math.PI) / 180),
          };
          const end = {
            x: center + radius * Math.cos((endAngle * Math.PI) / 180),
            y: center + radius * Math.sin((endAngle * Math.PI) / 180),
          };
          const startInner = {
            x: center + innerRadius * Math.cos((startAngle * Math.PI) / 180),
            y: center + innerRadius * Math.sin((startAngle * Math.PI) / 180),
          };
          const endInner = {
            x: center + innerRadius * Math.cos((endAngle * Math.PI) / 180),
            y: center + innerRadius * Math.sin((endAngle * Math.PI) / 180),
          };

          const largeArcFlag = endMinutes - startMinutes > 720 ? 1 : 0;

          const path = `
              M ${start.x} ${start.y}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
              L ${endInner.x} ${endInner.y}
              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
              Z
            `;

          return (
            <path
              key={idx}
              d={path}
              fill={plan.color}
              stroke="white"
              strokeWidth="1"
              className="transition-opacity hover:opacity-80 cursor-pointer"
              onClick={() => setSelectedId(plan?.id ?? null)}
            />
          );
        })}
      </svg>
    </div>
  );
};
export default TimeWheel;
