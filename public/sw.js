if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, n) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const r = (e) => a(e, i),
      o = { module: { uri: i }, exports: t, require: r };
    s[i] = Promise.all(c.map((e) => o[e] || r(e))).then((e) => (n(...e), t));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "b91130862612c0090747b1f170b7d6bd",
        },
        {
          url: "/_next/static/cKN3rz0-hxLI-E-0jIe8O/_buildManifest.js",
          revision: "4050366e51a1cb49b27507fa55ec449e",
        },
        {
          url: "/_next/static/cKN3rz0-hxLI-E-0jIe8O/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/149-72aa3b323b2ed21f.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/4bd1b696-00a56fb0d3c49491.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/517-510a54d6aacdac82.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/576-004a0c82d5421c87.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/615-c95e5f580277596f.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/933-448e4c5136d97b6c.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/970-42f918e043921c7e.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/ad2866b8-214ee3643fd29537.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-cede85d1e1497208.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-033817af9816f076.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/categories/page-736e004cfb82a840.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/layout-f333a1ec4cc86b84.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/login/page-fbf49679aa334be6.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/page-241e1f711dbee076.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/schedule-report/page-c31690f1d52cf115.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/app/schedule/page-02a74c8e192dc0bf.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/ca377847-be0f27e16342a22a.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/framework-6b27c2b7aa38af2d.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/main-app-8b57b7fd3e52be9d.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/main-c05ffb54497aa169.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-ca666c7599f60c94.js",
          revision: "cKN3rz0-hxLI-E-0jIe8O",
        },
        {
          url: "/_next/static/css/156ea659734faded.css",
          revision: "156ea659734faded",
        },
        {
          url: "/_next/static/css/17bb6c76c02c0930.css",
          revision: "17bb6c76c02c0930",
        },
        {
          url: "/_next/static/media/569ce4b8f30dc480-s.p.woff2",
          revision: "ef6cefb32024deac234e82f932a95cbd",
        },
        {
          url: "/_next/static/media/747892c23ea88013-s.woff2",
          revision: "a0761690ccf4441ace5cec893b82d4ab",
        },
        {
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        {
          url: "/_next/static/media/google.f78a7184.svg",
          revision: "ab454151c835a16ab69775077c25a4ed",
        },
        {
          url: "/_next/static/media/kakao.0e0e069d.png",
          revision: "b2df8abced56e0bbd49f7878a411e9c0",
        },
        {
          url: "/_next/static/media/naver.7a9fa8a1.png",
          revision: "9b8bbec2b446ff566ce2df35bc2d7905",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/google.svg", revision: "ab454151c835a16ab69775077c25a4ed" },
        { url: "/kakao.png", revision: "b2df8abced56e0bbd49f7878a411e9c0" },
        {
          url: "/logo/logo-144.png",
          revision: "e253dd7a287a6a74b52fe8e3f8a9b1e0",
        },
        {
          url: "/logo/logo-192.png",
          revision: "a39f172fbede6953432bc691694cccdb",
        },
        {
          url: "/logo/logo-512.png",
          revision: "8322b2dd0b1294ef144809cce4df8006",
        },
        { url: "/naver.png", revision: "9b8bbec2b446ff566ce2df35bc2d7905" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/public/sw.js", revision: "14249b5a0e81411dc226becd35f94173" },
        {
          url: "/public/workbox-4754cb34.js",
          revision: "9647ce85c9195576aae12296ab4f124e",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: c,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
