"use client";

import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import Image from "next/image";

import { Plus } from "lucide-react";

import { ThermometerSun } from "lucide-react";
import { Droplets } from "lucide-react";
import { Wind } from "lucide-react";
import mask from "../../public/mask.png";

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

const dustGradeMap: { [key: number]: string } = {
  1: "좋음",
  2: "보통",
  3: "나쁨",
  4: "매우나쁨",
};

const dustHexColor: { [key: string]: string } = {
  1: "#01579b",
  2: "#2e7d32",
  3: "#b57d00",
  4: "#D32F2F",
};

const skyMap: { [key: string]: string } = {
  1: "맑음",
  3: "구름 많음",
  4: "흐림",
};

const getShortRegionName = (
  name: string | undefined
): ShortRegionName | undefined => {
  if (name && name in regionMap) {
    return regionMap[name as FullRegionName];
  }
  return undefined;
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
  const [sky, setSky] = useState(0);
  const [pm10Value, setPm10Value] = useState(0); // 미세먼지
  const [pm10Grade, setPm10Grade] = useState(0); // 미세먼지 등급
  const [pm25Value, setPm25Value] = useState(0); // 초미세먼지
  const [pm25Grade, setPm25Grade] = useState(0); // 초미세먼지

  useEffect(() => {
    const today = dayjs().format("YYYYMMDD");
    const baseTime = getHour();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // 로케이션 to x,y 좌표
          const locationToXY = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const locationToXYJson = await locationToXY.json();

          // 초단기실황
          const ultraSrtNcst = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtNcst?serviceKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${baseTime}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
          );
          const ultraSrtNcstJson = await ultraSrtNcst.json();

          // 초단기예보
          const ultraSrtFcst = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtFcst?serviceKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${baseTime}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
          );
          const ultraSrtFcstJson = await ultraSrtFcst.json();

          // x,y to 시/도
          const addressInfo = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${position.coords.longitude}&y=${position.coords.latitude}`,
            {
              headers: {
                Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
              },
            }
          );

          const addressInfoJson = await addressInfo.json();

          const name = addressInfoJson?.documents[0]?.region_1depth_name;

          // 미세먼지 api
          const fineDust = await fetch(
            `${process.env.NEXT_PUBLIC_PARTICULATE_MATTER_API_URL}?serviceKey=${
              process.env.NEXT_PUBLIC_PARTICULATE_MATTER_API_KEY
            }&returnType=JSON&numOfRows=10&sidoName=${getShortRegionName(
              name
            )}&ver=1.0`
          );

          const fineDustJson = await fineDust.json();

          //미세먼지 농도와 등급 state
          setPm10Value(fineDustJson?.response?.body?.items[0]?.pm10Value);
          setPm10Grade(fineDustJson?.response?.body?.items[0]?.pm10Grade);
          setPm25Value(fineDustJson?.response?.body?.items[0]?.pm25Value);
          setPm25Grade(fineDustJson?.response?.body?.items[0]?.pm25Grade);

          // 초단기예보에서 가져온 sky 상태
          setSky(ultraSrtFcstJson?.response?.body?.items?.item[18]?.fcstValue);

          // 기온 관련 state
          setPrecipitation(
            ultraSrtNcstJson?.response?.body?.items?.item[0]?.obsrValue
          );
          setTemperature(
            ultraSrtNcstJson?.response?.body?.items?.item[3]?.obsrValue
          );
          setHumidity(
            ultraSrtNcstJson?.response?.body?.items?.item[1]?.obsrValue
          );
          setWindSpeed(
            ultraSrtNcstJson?.response?.body?.items?.item[7]?.obsrValue
          );
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
              <h3 className="font-semibold ">오늘의 날씨</h3>
            </div>
            <div className="flex justify-evenly p-6 pt-0 ">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 " color="#558bcf" />
                <div>
                  <span className="text-xs text-gray-500">습도</span>
                  <p className="text-sm font-medium">{humidity}%</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <div>
                    <span className="text-xs text-gray-500">바람</span>
                    <p className="text-sm font-medium">{windSpeed}km/h</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-evenly p-6 pt-0 ">
              <div className="flex items-center gap-2">
                <Image src={mask} alt="mask_img" width={16} height={16} />
                <div>
                  <span className="text-xs text-gray-500">미세먼지</span>
                  <p className="text-sm font-medium">{pm10Value}μg/m³</p>
                  <span
                    style={{ color: dustHexColor[pm10Grade] }}
                    className="font-bold text-sm"
                  >
                    {dustGradeMap[pm10Grade]}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Image src={mask} alt="mask_img" width={16} height={16} />
                  <div>
                    <span className="text-xs text-gray-500">초미세먼지</span>
                    <p className="text-sm font-medium">{pm25Value}μg/m³</p>
                    <span
                      style={{ color: dustHexColor[pm25Grade] }}
                      className="font-bold text-sm"
                    >
                      {dustGradeMap[pm25Grade]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg">
              <span>ㅋㅋ</span>
              <p>{skyMap[sky]}</p>
            </div>
          </div>
        </div>
        <></>
        <></>
      </div>
    </div>
  );
}
