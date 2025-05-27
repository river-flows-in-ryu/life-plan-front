"use client";

import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import Calendar from "react-calendar";

import { Plus } from "lucide-react";

import { ThermometerSun } from "lucide-react";

import "@/styles/calendar.css";

type FullRegionName = keyof typeof regionMap;
type ShortRegionName = (typeof regionMap)[FullRegionName];

const regionMap = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  경기도: "경기",
  강원특별자치도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전북특별자치도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
  세종특별자치시: "세종",
};

const getHour = () => {
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();

  let value;

  if (minute >= 10) {
    value = hour;
  } else {
    value = hour - 1;
    if (value < 0) {
      value = 23;
    }
  }

  return String(value).padStart(2, "0") + "00";
};

export default function Client() {
  const [precipitation, setPrecipitation] = useState(0); //강수량
  const [temperature, setTemperature] = useState(0); //기온
  const [humidity, setHumidity] = useState(0); //습도
  const [windSpeed, setWindSpeed] = useState(0); //풍속

  useEffect(() => {
    const today = dayjs().format("YYYYMMDD");
    const baseTime = getHour();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const res1 = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const resJson1 = await res1.json();

          const res2 = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${baseTime}&nx=${resJson1?.x}&ny=${resJson1?.y}`
          );
          const resJson = await res2.json();

          const res = await fetch(
            // `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${position.coords.longitude}&y=${position.coords.latitude}`,
            `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${127.2494855}&y=${36.5040736}`,

            {
              headers: {
                Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
              },
            }
          );

          const resJson2 = await res.json();

          const name = resJson2?.documents[0]?.region_1depth_name;

          if (name && name in regionMap) {
            const shortName = regionMap[name as FullRegionName];
            console.log(shortName); // "서울" 등
          }

          // console.log(regionMap[resJson2?.documents[0]?.region_1depth_name]);
          setPrecipitation(resJson?.response?.body?.items?.item[0]?.obsrValue);
          setTemperature(resJson?.response?.body?.items?.item[3]?.obsrValue);
          setHumidity(resJson?.response?.body?.items?.item[1]?.obsrValue);
          setWindSpeed(resJson?.response?.body?.items?.item[7]?.obsrValue);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("위치 정보 제공에 동의해 주세요.");
          }
        }
      );
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold">대시보드</h3>
          <span className="text-sm">오늘의 일정과 목표를 확인하세요</span>
        </div>
        <button className="h-10 flex items-center gap-2 bg-black px-4 py-2 rounded">
          <Plus color="white" />
          <span className="text-white">일정추가</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <div className="border rounded-lg">
            <div className="px-6 pt-6 pb-3">
              <h3 className="font-semibold">미니 캘린더</h3>
            </div>
            <Calendar
              locale="ko"
              calendarType="gregory"
              showNeighboringMonth={false}
              // tileClassName={getTileClassName}
              // tileContent={tileContent}
              // onChange={handleDateChange}
              formatDay={(locale, date) =>
                date.toLocaleString("en", { day: "numeric" })
              }
              // onActiveStartDateChange={handleActiveStartDateChange}
            />
          </div>
          <div className="mt-6 border rounded-lg">
            <div className="px-6 pt-6 pb-3 flex items-center gap-2 ">
              <ThermometerSun className="w-4 h-4" />
              <h3 className="font-semibold">오늘의 날씨</h3>
            </div>
          </div>
        </div>
        <></>
        <></>
      </div>
    </div>
  );
}
