"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import dayjs from "dayjs";

import { ThermometerSun } from "lucide-react";
import { Droplets } from "lucide-react";
import { Wind } from "lucide-react";
import mask from "../../../public/mask.png";
import { Crosshair } from "lucide-react";
import { MapPinHouse } from "lucide-react";

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

export default function WeatherOverview() {
  //
  const [precipitation, setPrecipitation] = useState(null); //강수량
  const [temperature, setTemperature] = useState(null); //기온
  const [humidity, setHumidity] = useState(0); //습도
  const [windSpeed, setWindSpeed] = useState(0); //풍속
  const [sky, setSky] = useState(null); //하늘 상태
  const [pm10Value, setPm10Value] = useState(0); // 미세먼지
  const [pm10Grade, setPm10Grade] = useState(0); // 미세먼지 등급
  const [pm25Value, setPm25Value] = useState(0); // 초미세먼지
  const [pm25Grade, setPm25Grade] = useState(0); // 초미세먼지

  const [currentLocation, setCurrentLocation] = useState("");
  const [dustStation, setDustStation] = useState("");

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
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtNcst?serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${baseTime}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
          );
          const ultraSrtNcstJson = await ultraSrtNcst.json();

          // 초단기예보
          const ultraSrtFcst = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}/getUltraSrtFcst?serviceKey=${process.env.NEXT_PUBLIC_GOV_OPEN_API_KEY}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${today}&base_time=${baseTime}&nx=${locationToXYJson?.x}&ny=${locationToXYJson?.y}`
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

  function getWeatherSummary(skyCode: number, ptyCode: number) {
    if (ptyCode !== 0 && ptyMap[ptyCode]) {
      return ptyMap[ptyCode];
    } else if (skyMap[skyCode]) {
      return skyMap[skyCode];
    } else {
      return "알 수 없음";
    }
  }

  function getWeatherText(skyCode: number, ptyCode: number, temp: number) {
    console.log(skyCode, ptyCode, temp);
    const weather = getWeatherSummary(skyCode, ptyCode);
    return `현재 날씨는 ${weather}이며, 기온은 ${temp}°C입니다.`;
  }

  return (
    <div className="mt-6 border rounded-lg">
      <div className="px-6 pt-6 pb-3 flex items-center gap-2 ">
        <ThermometerSun className="w-4 h-4" />
        <h3 className="font-semibold ">오늘의 날씨</h3>
      </div>
      <div className="flex justify-center font-bold text-2xl">
        {temperature}°C
      </div>
      <p className="text-center">{sky !== null ? skyMap[sky] : ""}</p>

      <div className="flex justify-evenly p-6 pt-0 mt-5">
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
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <span>대기질 정보</span>
          <span></span>
        </div>
        <div className=""></div>
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
        <p className="flex items-center gap-2">
          <Crosshair width={16} height={16} />
          <span>현재 위치 {currentLocation}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPinHouse width={16} height={16} />
          <span>가까운 측정소 {dustStation}</span>
        </p>
        <div className="bg-[#f4f4f4] px-1 py-2.5 rounded">
          {sky !== null &&
            precipitation !== null &&
            temperature !== null &&
            getWeatherText(sky, precipitation, temperature)}
        </div>
      </div>
    </div>
  );
}
