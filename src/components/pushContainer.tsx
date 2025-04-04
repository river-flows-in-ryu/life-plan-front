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
          await navigator.serviceWorker.register("/worker/index.js", {
            scope: "/worker/",
          });

          await navigator.serviceWorker.register("/sw.js");

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
        // 1. 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // 2. 🚀 푸시 알림 서비스워커를 명확하게 가져오기
        const registration = await getWorkerRegistration();
        if (!registration) {
          console.error("푸시 알림용 서비스워커가 등록되지 않았습니다.");
          return;
        }

        // 3. 브라우저의 현재 구독 정보 확인
        const browserSubscription =
          await registration.pushManager.getSubscription();

        // 4. 서버에 저장된 구독 정보 확인
        const serverSubscription = await fetchServerSubscription();

        if (browserSubscription) {
          if (serverSubscription) {
            if (browserSubscription.endpoint !== serverSubscription) {
              await browserSubscription.unsubscribe();
              const newSubscription = await createNewSubscription(registration);
              await sendSubscriptionToServer(newSubscription);
              setSubscription(newSubscription);
            } else {
              setSubscription(browserSubscription);
            }
          } else {
            await sendSubscriptionToServer(browserSubscription);
            setSubscription(browserSubscription);
          }
        } else {
          const newSubscription = await createNewSubscription(registration);
          await sendSubscriptionToServer(newSubscription);
          setSubscription(newSubscription);
        }
      } catch (error) {
        console.error(error);
      }
    };

    initializePushNotification();
  }, [isServiceWorkerRegistered, session]);

  // 🚀 푸시 알림 서비스워커를 정확히 가져오는 함수
  const getWorkerRegistration = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.find((reg) => reg.scope.endsWith("/worker/"));
  };

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

      if (response.status === 410) {
        const registration = await getWorkerRegistration();
        if (!registration) throw new Error("푸시 알림용 SW가 등록되지 않음");

        const newSubscription = await createNewSubscription(registration);

        const newResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/push/subscribe/`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: JSON.stringify(newSubscription),
          }
        );
        if (!newResponse.ok) throw new Error("새로운 구독 전송 실패");

        setSubscription(newSubscription);
        return newSubscription;
      }

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
      console.error("서버 구독 정보 조회 중 오류", error);
      return null;
    }
  };

  //테스트
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

  //test
  // async function testServiceWorkerNotification() {
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-push/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.user?.accessToken}`,
  //       },
  //     });

  //     const data = await res.json();

  //     if (res.status === 410) {
  //       console.warn("구독이 만료됨. 다시 구독을 시도합니다.");

  //       // 🧩 새로 구독하기
  //       const registration = await getWorkerRegistration();
  //       if (!registration) throw new Error("푸시 알림용 SW가 등록되지 않음");

  //       const newSubscription = await createNewSubscription(registration);

  //       // 🔄 서버에 새 구독 정보 전송
  //       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe/`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.user?.accessToken}`,
  //         },
  //         body: JSON.stringify(newSubscription),
  //       });

  //       console.log("재구독 성공! 다시 푸시 요청 가능");
  //     } else {
  //       console.log("푸시 테스트 결과:", data);
  //     }
  //   } catch (error) {
  //     console.error("푸시 테스트 실패:", error);
  //   }
  // }

  return (
    //
    <div>
      <Suspense>
        {/* <button onClick={triggerPush}>테스트 푸시 알림 보내기</button> */}
        {/* <button onClick={testServiceWorkerNotification}>
          푸시 알림 보내기
        </button> */}
        {children}
      </Suspense>
    </div>
  );
}
