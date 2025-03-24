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
    if (!isServiceWorkerRegistered) return;

    const initializePushNotification = async () => {
      if (session) {
        try {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            return;
          }

          const registration = await navigator.serviceWorker.ready;
          const existingSubscription =
            await registration.pushManager.getSubscription();

          const serverSubscription = await fetchServerSubscription();

          //브라우저에 구독 정보 존재여부
          if (existingSubscription) {
            // 서버에 구독 정보 존재여부
            if (serverSubscription) {
              // 브라우저와 서버 구독 정보가 다를때
              if (
                existingSubscription.endpoint !== serverSubscription.endpoint
              ) {
                await existingSubscription.unsubscribe();
                const newSubscription = await createNewSubscription(
                  registration
                );
                await sendSubscriptionToServer(newSubscription);
                setSubscription(newSubscription);
              } else {
                setSubscription(existingSubscription);
              }
            } else {
              await sendSubscriptionToServer(existingSubscription);
              setSubscription(existingSubscription);
            }
          } else {
            const newSubscription = await createNewSubscription(registration);
            await sendSubscriptionToServer(newSubscription);
            setSubscription(newSubscription);
          }
        } catch (error) {
          console.error("푸시 알림 초기화 중 오류 발생:", error);
        }
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
      const data = await response.json();
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
