"use client";
import React, { Children, useEffect } from "react";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const askNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const registrations = await navigator.serviceWorker.ready;
    const pushSubscription = await registrations.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_PUSH_NOTIFICATION_KEY || ""
      ),
    });
    await savePushSubscription(pushSubscription);
  }
};

const savePushSubscription = async (subscription: PushSubscription) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/push-notifications`,
    {
      method: "POST",
      body: JSON.stringify({ subscription }),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await res.json();
  if (data.success) {
    console.log("푸시 구독 저장 성공!");
  } else {
    console.error("푸시 구독 저장 실패");
  }
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AuthContainer({ children }: Props) {
  useEffect(() => {
    askNotificationPermission();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
