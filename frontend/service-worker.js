const CACHE_NAME = "vigilix-cache-v1";

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  self.skipWaiting(); // Important fix
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
});

self.addEventListener("fetch", (event) => {
  // Just fetch normally (no cache error)
  event.respondWith(fetch(event.request));
});