console.log("서비스 워커 파일이 로드됨!");

// self.addEventListener("push", async function (event) {
//   console.log("[Service Worker] Push Received.");
//   console.log("[Service Worker] Push had this ", event.data.text());

//   try {
//     // 데이터 파싱
//     const payload = event.data ? event.data.json() : {};
//     console.log("[Service Worker] 수신된 데이터:", payload);

//     // 알림 표시
//     const notificationPromise = self.registration.showNotification(
//       payload.head || "알림",
//       {
//         body: payload.body,
//         icon: payload.icon || "/logo/logo-192.png",
//         data: payload.data,
//         tag: `plan-${payload.data?.plan_id}`,
//         requireInteraction: true,
//         actions: [
//           {
//             action: "view",
//             title: "일정 보기",
//           },
//         ],
//       }
//     );

//     event.waitUntil(notificationPromise);
//     console.log("[Service Worker] 알림 표시 요청됨");
//   } catch (error) {
//     console.error("[Service Worker] Push 이벤트 처리 중 에러:", error);
//   }
// });

// /public/worker/index.js
self.addEventListener("push", async function (event) {
  console.log("[Service Worker] Push Received - Raw Data:", event.data);
  console.log("[Service Worker] Push Data Text:", event.data?.text());

  if (!event.data) {
    console.warn("[Service Worker] Push 이벤트에 데이터가 없습니다");
    return;
  }

  // 데이터 파싱 전 원본 확인
  const rawData = event.data.text();
  console.log("[Service Worker] Raw Data:", rawData);

  try {
    const payload = JSON.parse(rawData);
    console.log("[Service Worker] Parsed Payload:", payload);

    await self.registration.showNotification(payload.head || "알림", {
      body: payload.body,
      icon: payload.icon || "/logo/logo-192.png",
      data: payload.data,
      tag: payload.data?.test ? "test-notification" : undefined,
      requireInteraction: true,
    });
  } catch (error) {
    console.error("[Service Worker] 푸시 처리 중 에러:", error);
  }
});

self.addEventListener("install", (event) => {
  console.log("🔹 서비스 워커 sw.js 설치됨");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("🔹 서비스 워커 sw.js 활성화됨");
  event.waitUntil(self.clients.claim());
  // 활성화가 완료된 후 확인
  self.clients.matchAll().then((clients) => {
    console.log("현재 활성화된 클라이언트:", clients);
  });
});
