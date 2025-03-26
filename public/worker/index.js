self.addEventListener("push", (event) => {
  const textData = event.data?.text() || "{}";
  const data = JSON.parse(textData);

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/logo/logo-192.png",
    })
  );
});
self.addEventListener("install", (event) => {
  console.log("Service Worker 설치됨");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker 활성화됨");
});
