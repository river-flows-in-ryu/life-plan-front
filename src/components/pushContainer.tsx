"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

// const askNotificationPermission = async () => {
//   const permission = await Notification.requestPermission();
//   if (permission === "granted") {
//     const registrations = await navigator.serviceWorker.ready;
//     const pushSubscription = await registrations.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(
//         process.env.NEXT_PUBLIC_PUSH_NOTIFICATION_KEY || ""
//       ),
//     });
//     await savePushSubscription(pushSubscription);
//   }
// };

// const savePushSubscription = async (subscription: PushSubscription) => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/push-notifications`,
//     {
//       method: "POST",
//       body: JSON.stringify({ subscription }),
//       headers: { "Content-Type": "application/json" },
//     }
//   );
//   const data = await res.json();
//   if (data.success) {
//     console.log("푸시 구독 저장 성공!");
//   } else {
//     console.error("푸시 구독 저장 실패");
//   }
// };

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

export default function PushContainer({ children }: Props) {
  const { data: session } = useSession();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js") // sw.js 경로 설정
        .then((registration) => {
          console.log("Service Worker 등록 성공:", registration);
        })
        .catch((error) => {
          console.error("Service Worker 등록 실패:", error);
        });
    } else {
      console.log("이 브라우저는 서비스 워커를 지원하지 않습니다.");
    }
  }, []);

  // useEffect(() => {
  //   if (Boolean(session)) {
  //     askNotificationPermission();
  //   }
  // }, [session]);

  const sendTestPushNotification = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-push/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      console.log("푸시 알림 전송 성공!");
    } else {
      console.error("푸시 알림 전송 실패");
    }
  };

  useEffect(() => {
    // 서비스 워커 등록 확인
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js") // sw.js 파일 경로
        .then((registration) => {
          console.log("Service Worker 등록 성공:", registration);
        })
        .catch((error) => {
          console.error("Service Worker 등록 실패:", error);
        });
    } else {
      console.log("이 브라우저는 서비스 워커를 지원하지 않습니다.");
    }

    // 푸시 알림 권한 확인
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("알림 권한이 허용되었습니다.");
        } else {
          console.log("알림 권한이 거부되었습니다.");
        }
      });
    }
  }, []);

  return (
    //
    <div>
      <Suspense>
        <button onClick={sendTestPushNotification}>
          테스트 푸시 알림 보내기
        </button>
        {children}
      </Suspense>
    </div>
  );
}
