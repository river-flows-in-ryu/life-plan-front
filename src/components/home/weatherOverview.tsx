"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import dayjs from "dayjs";

import { ThermometerSun } from "lucide-react";
import { Droplets } from "lucide-react";
import { Wind } from "lucide-react";
import mask from "../../../public/mask.png";
import { Crosshair } from "lucide-react";
import { MapPinHouse, Cloud, Sun } from "lucide-react";

import {
  dustGradeClassMap,
  dustGradeLabelMap,
  weatherStates,
} from "@/styles/homePageStyle";

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

const skyMap: { [key: number]: string } = {
  0: "",
  1: "맑음",
  3: "구름 많음",
  4: "흐림",
};

const ptyMap: { [key: number]: string } = {
  0: "",
  1: "비",
  2: "비 또는 눈",
  3: "눈",
  5: "빗방울",
  6: "빗방울 또는 눈날림",
  7: "눈날림",
};

const getHour = (type: "실황" | "예보") => {
  const now = dayjs();
  const hour = now.hour();
  const minute = now.minute();

  let value;

  if (type === "실황") {
    if (minute >= 10) {
      value = hour;
    } else {
      value = hour - 1;
      if (value < 0) {
        value = 23;
      }
    }
    return String(value).padStart(2, "0") + "00";
  }
  if (type === "예보") {
    if (minute < 30) {
      value = hour - 1;
      if (value < 0) value = 23;
      return String(value).padStart(2, "0") + "30";
    } else {
      value = hour;
      return String(value).padStart(2, "0") + "00";
    }
  }
};

export default function WeatherOverview() {
  const [precipitation, setPrecipitation] = useState(null); //강수량
  const [temperature, setTemperature] = useState(null); //기온
  const [humidity, setHumidity] = useState(0); //습도
  const [windSpeed, setWindSpeed] = useState(0); //풍속
  const [sky, setSky] = useState<number | null>(null); //하늘 상태
  const [pm10Value, setPm10Value] = useState(0); // 미세먼지
  const [pm10Grade, setPm10Grade] = useState(0); // 미세먼지 등급
  const [pm25Value, setPm25Value] = useState(0); // 초미세먼지
  const [pm25Grade, setPm25Grade] = useState(0); // 초미세먼지

  const [currentLocation, setCurrentLocation] = useState("");
  const [dustStation, setDustStation] = useState("");

  const dustGrade = Math.max(pm10Grade, pm25Grade) || 1;

  useEffect(() => {
    const today = dayjs().format("YYYYMMDD");
    const nowcast = getHour("실황");
    const forecast = getHour("예보");

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
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtNcst?serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${nowcast}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
          );
          const ultraSrtNcstJson = await ultraSrtNcst.json();

          // 초단기예보
          const ultraSrtFcst = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtFcst?serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${forecast}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
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

          const { region_1depth_name, region_2depth_name, region_3depth_name } =
            addressInfoJson?.documents[0];

          setCurrentLocation(
            `${region_1depth_name} ${region_2depth_name} ${region_3depth_name}`
          );

          // 현재 위치를 tmX,tmY로 변경
          const locationToTMXY = await fetch(
            `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getTMStdrCrdnt?umdName=${region_3depth_name}&pageNo=1&numOfRows=10&returnType=json&serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}`
          );
          const locationToTMXYJson = await locationToTMXY.json();
          const tmX = locationToTMXYJson?.response?.body?.items[0]?.tmX;
          const tmY = locationToTMXYJson?.response?.body?.items[0]?.tmY;

          // 가까운 위치의 측정소 구하기
          const nearestStation = await fetch(
            `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?tmX=${tmX}&tmY=${tmY}&returnType=json&serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}`
          );
          const nearestStationJson = await nearestStation.json();
          const stationName =
            nearestStationJson?.response?.body?.items[0]?.stationName;

          setDustStation(stationName);

          // 가까운 위치의 미세먼지 api
          const fineDust = await fetch(
            `${process.env.NEXT_PUBLIC_PARTICULATE_MATTER_API_URL}?stationName=${stationName}&dataTerm=month&pageNo=1&numOfRows=100&returnType=json&serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}&ver=1.0`
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

  const getWeatherSummary = (
    skyCode: number | null,
    ptyCode: number | null
  ) => {
    if (ptyCode !== null && ptyCode !== 0 && ptyMap[ptyCode]) {
      return ptyMap[ptyCode];
    } else if (skyCode !== null && skyMap[skyCode]) {
      return skyMap[skyCode];
    } else {
      return "알 수 없음";
    }
  };

  const getWeatherText = (skyCode: number, ptyCode: number, temp: number) => {
    const weather = getWeatherSummary(skyCode, ptyCode);
    return `현재 날씨는 ${weather}이며, 기온은 ${temp}°C입니다.`;
  };

  const getWeatherStyle = (sky: number | null, pty: number | null) => {
    const skyLabel = sky !== null ? skyMap[sky] : "";
    const ptyLabel = pty !== null ? ptyMap[pty] : "";

    if (ptyLabel) {
      if (pty === 1) {
        return weatherStates.find((s) => s.name === "비") || null;
      }

      if (pty === 3 || pty === 7) {
        return weatherStates.find((s) => s.name === "눈") || null;
      }

      if (pty === 5 || pty === 6 || pty === 2) {
        return weatherStates.find((s) => s.name === "빗방울") || null;
      }
    }
    return weatherStates.find((s) => s.name === skyLabel) || null;
  };

  const weather = getWeatherStyle(sky, precipitation);

  const Icon = weather?.icon;

  return (
    <div className="mt-6 border rounded-lg">
      <div
        className={`px-6 py-8 relative rounded-t-lg ${weather?.bgColor} ${weather?.borderColor} ${weather?.gradient}`}
      >
        <div className="flex justify-center px-4 py-2 mb-4">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
            {Icon && <Icon />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getWeatherSummary(sky, precipitation)}
            </span>
          </div>
        </div>
        <p className="text-center text-4xl font-bold text-gray-900 mb-2">
          {temperature} °C
        </p>
        <div className="absolute top-4 right-1">
          {Icon && <Icon className="w-24 h-24" color="#cecece" />}
        </div>
      </div>
      <div className="p-6">
        <div className="flex gap-4">
          <div
            className={`p-4 flex items-center w-1/2 gap-3 border rounded-2xl ${weather?.bgColor} ${weather?.borderColor}`}
          >
            <div className={`w-9 h-9 p-2 rounded-xl ${weather?.iconBg}`}>
              <Droplets
                className={`text-gray-500 ${weather?.iconColor}`}
                width={20}
                height={20}
              />
            </div>
            <div className="">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                습도
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {humidity}%
              </p>
            </div>
          </div>
          <div
            className={`p-4 flex items-center w-1/2 gap-1  border rounded-2xl ${weather?.bgColor} ${weather?.borderColor}`}
          >
            <div className="w-9 h-9 bg-green-100 dark:bg-green-900 p-2 rounded-xl items-center">
              <Wind className="text-green-600" width={20} height={20} />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                바람
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {windSpeed}km/h
              </p>
            </div>
          </div>
        </div>
        <div className={`mt-4 p-4 ${dustGradeClassMap[dustGrade]}`}>
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              대기질 정보
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-medium  ${dustGradeLabelMap[dustGrade]}`}
            >
              보통
            </span>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                미세먼지 (PM10)
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pm10Value}μg/m³
              </p>
            </div>
            <div className="w-1/2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                초미세먼지 (PM2.5)
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pm25Value}μg/m³
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-2 text-gray-600 dark:text-gray-400 text-sm">
          <div className="flex gap-2">
            <Crosshair width={16} height={16} />
            <span>현재 위치 : {currentLocation}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <MapPinHouse width={16} height={16} />
            <span>가까운 측정소 : {dustStation}</span>
          </div>
        </div>
        {/* <div className="mt-4 p-4"></div> */}
      </div>
    </div>
  );
}
