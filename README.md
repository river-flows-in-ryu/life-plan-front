# 🗓️ Just Plan


## 📌 프로젝트 소개
이 프로젝트는 **하루 일정을 구체적으로 기록하고 관리할 수 있는 생활계획표 서비스**입니다.  
처음에는 단순히 성인들도 사용할 수 있는 ‘계획표 앱’을 떠올렸지만, 스스로 “조금 나태해진 게 아닌가?”라는 고민에서 출발했습니다.  
그래서 **나에게 필요한 기능을 직접 정의하고, 나의 생활 패턴을 개선하기 위해** 이 프로젝트를 만들었습니다.

- 🔹 **Pain Point**: 하루 계획이 흐트러지고, 일정이 체계적으로 관리되지 않음  
- 🔹 **Solution**: 디지털 생활계획표를 만들어 일정 기록과 관리 과정을 단순화  
- 🔹 **Goal**: 스스로 더 계획적으로 생활할 수 있는 도구 제작  


## 🗂️ 개요

- **프로젝트 이름**: Just Plan  
- **프로젝트 기간**: 2025.01~
- 1인 프로젝트 프론트엔드 & 백엔드 & 기획


## 💻 개발 환경

| 구분      | 기술 스택 |
|-----------|-----------|
| Frontend  | React, TypeScript, Tailwind CSS, NextAuth, Next-PWA, React Hook Form |
| Backend   | Django REST Framework, Redis, SQLite3 |
| 기타      | Gemini API (일정 카테고리 분류), Docker (프론트 이미지화) |


## 코드 컨벤션
- 값이 변하지 않는 변수는 const를, 값이 변하는 변수는 let을 사용하여 선언한다. var는 절대로 사용하지 않도록 한다.
- 카멜 케이스를 사용한다.
- boolean 타입은 is라는 접두사 사용
- import 순서 정렬
```
import React from "react";  // default

import Image from "next/image"; //외부 라이브러리 사용 1순위

import ProductDetail from "./productDetail"; // 작성한 컴포넌트 2순위

import { commonFetch } from "@/utils/commonFetch"; // util 사용값 3순위

import arrowDown from "../public/arrow_down.png"; // 이미지 등 파일 4순위

import { useCartCountStore, useUserIdStore } from "@/app/store"; 함수, 값 등 불러오는 파일 5순위
```

---

## ⚙️ 주요 기능

### 1️⃣ 일정 관리
- 📝 **일정 추가/수정/삭제**: 하루 24시간을 타원형 도넛 형태로 시각화하여 직관적인 일정 관리  
- 🔁 **반복 일정 지원**: 여러 반복 일정 등록 가능  

### 2️⃣ 카테고리 분류
- 🤖 **Gemini API 기반 자동 분류**: 일정 제목을 분석하여 카테고리 자동 분류  
- ✏️ **카테고리 변경 기능**: 단일 또는 다중 카테고리 변경 가능  

### 3️⃣ 일정 보고서 (Report)
- 📊 **기간별 확인**: 일간, 주간, 사용자 지정 기간별 일정 소요시간 확인 가능  
- 📈 **시각화**: 카테고리별 일정 도식화

### 4️⃣ 알림 및 목표 관리
- 🔔 **Next.js PWA 기반 알림**: 일정 5분 전 푸시 알림 지원  
- 🎯 **목표 설정 및 달성률 확인**: 개인 목표 달성률 표시 및 뱃지 제공  

### 5️⃣ 인증 및 사용자 관리
- 🔐 **NextAuth OAuth 로그인**: Google 계정 등 OAuth 기반 인증  
- 👤 **사용자 맞춤 경험**: 로그인한 사용자별 일정과 목표 관리  

---



## 📚 기록한 기술 사항
- [Next-PWA 적용해보기](https://ryugaram.tistory.com/173)  
- [Next-PWA 푸시 알림 트러블슈팅](https://ryugaram.tistory.com/174)  
- [Next-PWA Custom Service Worker 등록](https://ryugaram.tistory.com/175)
- [Docker 도입기](https://ryugaram.tistory.com/176)
- [Gemini API 활용 이유](https://ryugaram.tistory.com/172)  

---

## 📝 회고

이번 프로젝트는 **여러 새로운 기술로** 인하여 구현 과정에서 여러 문제를 마주했습니다. <br/>
하지만 내가 직접 필요로 하고, 해보고 싶었던 기능을 하나씩 만들어 나가면서 즐겁게 진행할 수 있었습니다.    

이번 경험을 통해 문제를 정의하고 해결하는 흐름을 직접 경험할 수 있었고, 앞으로도 이런 과정을 통해 더 잘할 수 있을 것 같다는 자신감을 얻었습니다.

---
## 프론트 화면

### 일정 추가 및 일정 확인
<img width="800" height="600" alt="Image" src="https://github.com/user-attachments/assets/f2337e42-6593-4832-a630-52e05a8c32a3" />

### 반복일정
<img width="837" height="867" alt="Image" src="https://github.com/user-attachments/assets/c7fe20b2-bc31-47bb-a282-2666f977ede5" />


### report
<img width="1060" height="815" alt="Image" src="https://github.com/user-attachments/assets/2216f192-d4dd-4443-a6b1-3cf9df74e5fa" />


### 목표관리
<img width="938" height="873" alt="Image" src="https://github.com/user-attachments/assets/e7c03c72-2b86-4da6-b636-e235cd183ef2" />

### 뱃지
<img width="1044" height="448" alt="Image" src="https://github.com/user-attachments/assets/66e80b06-e6ef-428a-b0d7-646a1b34f47c" />


### 카테고리 내역
<img width="800" height="400" alt="Image" src="https://github.com/user-attachments/assets/d53edc00-9711-439f-86bf-0cd6b8812aee" />

### 단일 카테고리 변경
<img width="300" height="300" alt="Image" src="https://github.com/user-attachments/assets/6c9d2b13-2bed-4873-bde4-66f45d12594f" />


### 카테고리 일괄 
<img width="800" height="600" alt="Image" src="https://github.com/user-attachments/assets/d9ee5716-4a29-4b6f-816a-02369f07c1d0" />


### 대시보드
<img width="970" height="868" alt="Image" src="https://github.com/user-attachments/assets/c30a5aed-aeb4-40ff-80cd-fa047771f941" />

