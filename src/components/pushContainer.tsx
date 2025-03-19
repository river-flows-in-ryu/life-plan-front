"use client";

import urlBase64ToUint8Array from "@/utils/push";
import React, { useEffect, useState } from "react";

import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

export default function PushContainer({ children }: Props) {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    const registerWorkers = async () => {
      if ("serviceWorker" in navigator) {
        try {
          // 서비스 워커 등록
          await navigator.serviceWorker.register("/sw.js");
          await navigator.serviceWorker.register("/worker/index.js");

          setIsServiceWorkerRegistered(true);
        } catch (error) {
          console.error("SW 등록 실패:", error);
        }
      } else {
        console.log("서비스 워커를 지원하지 않는 브라우저입니다.");
      }
    };

    registerWorkers();
  }, []);

  useEffect(() => {
    if (!isServiceWorkerRegistered) return;

    const initializePushNotification = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("알림 권한이 거부되었습니다.");
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();

        if (existingSubscription) {
          console.log("기존 구독이 존재합니다.");
          setSubscription(existingSubscription);
          return;
        }

        const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
        const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });

        await sendSubscriptionToServer(newSubscription);
        setSubscription(newSubscription);
        console.log("푸시 알림 구독이 완료되었습니다.");
      } catch (error) {
        console.error("푸시 알림 초기화 중 오류 발생:", error);
      }
    };
    initializePushNotification();
  }, [isServiceWorkerRegistered]);

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/push/subscribe/`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        }
      );
      if (!response.ok) {
        throw new Error("구독 정보 전송 실패");
      }
    } catch (error) {
      console.error("서버 전송 중 오류:", error);
    }
  };

  async function testServiceWorkerNotification() {
    // 권한 확인
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("알림 권한이 거부되었습니다");
        return;
      }
    }

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification("테스트 알림", {
        body: "서비스 워커를 통한 로컬 알림입니다.",
        icon: "/logo/logo-192.png",
      });
    }
  }

  return (
    //
    <div>
      <Suspense>
        {/* <button onClick={triggerPush}>테스트 푸시 알림 보내기</button> */}
        <button onClick={testServiceWorkerNotification}>
          푸시 알림 보내기
        </button>
        {children}
      </Suspense>
    </div>
  );
}
