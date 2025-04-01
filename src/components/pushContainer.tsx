"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";

import { useSession } from "next-auth/react";

import urlBase64ToUint8Array from "@/utils/push";

interface Props {
  children: React.ReactNode;
}

export default function PushContainer({ children }: Props) {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const { data: session } = useSession();

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
    if (!isServiceWorkerRegistered || !session) return;

    const initializePushNotification = async () => {
      try {
        // 1 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // 2 서비스 워커 준비 확인
        const registeration = await navigator.serviceWorker.ready;

        // 3 브라우저의 현재 구독 정보 확인
        const browserSubscription =
          await registeration.pushManager.getSubscription();

        // 4 서버에 저장된 구독 정보 확인
        const serverSubscription = await fetchServerSubscription();

        // Case 1: 브라우저에 구독 정보가 있는 경우
        if (browserSubscription) {
          // Case 1-1: 서버에도 구독 정보가 있는 경우
          if (serverSubscription) {
            // 엔드포인트 비교하여 다른 경우 => 새로운 구독 생성 필요
            if (browserSubscription.endpoint !== serverSubscription) {
              await browserSubscription.unsubscribe();
              const newSubscription = await createNewSubscription(
                registeration
              );
              await sendSubscriptionToServer(newSubscription);
              setSubscription(newSubscription);
            } else {
              // 엔드포인트가 같은 경우 => 기존 구독 유지
              setSubscription(browserSubscription);
            }
          }
          // Case 1-2: 서버에 구독 정보가 없는 경우
          else {
            await sendSubscriptionToServer(browserSubscription);
            setSubscription(browserSubscription);
          }
        }
        // Case 2: 브라우저에 구독 정보가 없는 경우
        else {
          const newSubscription = await createNewSubscription(registeration);
          await sendSubscriptionToServer(newSubscription);
          setSubscription(newSubscription);
        }
      } catch (error) {
        console.error(error);
      }
    };
    initializePushNotification();
  }, [isServiceWorkerRegistered, session]);

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/push/subscribe/`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(subscription),
        }
      );
      if (!response.ok) {
        throw new Error("구독 정보 전송 실패");
      }
      return await response.json();
    } catch (error) {
      console.error("서버 전송 중 오류:", error);
    }
  };

  const fetchServerSubscription = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-subscription`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error("서버 구독 정보 조회중 오류", error);
      return null;
    }
  };

  const createNewSubscription = async (
    registration: ServiceWorkerRegistration
  ) => {
    const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
    const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    return newSubscription;
  };

  async function testServiceWorkerNotification() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-push/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log("푸시 테스트 결과:", data))
      .catch((error) => console.error("푸시 테스트 실패:", error));
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
