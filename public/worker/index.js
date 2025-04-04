self.addEventListener("push", async function (event) {
  console.log("[Service Worker] Push Received.");

  try {
    // 서비스 워커 상태 확인
    console.log("Service Worker 상태:", {
      scope: self.registration.scope,
      active: !!self.registration.active,
    });

    // 알림 권한 상태 확인
    console.log("Notification 권한:", Notification.permission);

    const payload = event.data ? event.data.json() : {};
    console.log("[Service Worker] 수신된 데이터:", payload);

    // 알림 옵션 로깅
    const notificationOptions = {
      body: payload.body || "새로운 알림이 있습니다.",
      icon: "/logo/logo-192.png",
      badge: "/logo/logo-192.png",
      data: payload.data || {},
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: "view",
          title: "일정 보기",
        },
      ],
    };
    console.log("알림 옵션:", notificationOptions);

    // Promise 체인으로 상세 에러 확인
    const notificationPromise = self.registration
      .showNotification(
        payload.head || payload.title || "알림",
        notificationOptions
      )
      .then(() => {
        console.log("알림 표시 성공");
      })
      .catch((error) => {
        console.error("알림 표시 실패:", {
          message: error.message,
          stack: error.stack,
        });
      });

    event.waitUntil(notificationPromise);
  } catch (error) {
    console.error("[Service Worker] 처리 중 에러:", {
      message: error.message,
      stack: error.stack,
    });
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click received.");
  console.log("Trying to open URL:", "/schedule");

  event.notification.close();

  event.waitUntil(
    (async () => {
      try {
        const client = await clients.openWindow("/schedule");
        console.log("Window opened successfully:", client);
        return client;
      } catch (error) {
        console.error("Failed to open window:", error);
      }
    })()
  );
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
