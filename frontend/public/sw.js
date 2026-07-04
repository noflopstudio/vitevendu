const CACHE_NAME = "vitevendu-v1";

const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icon-192.png",
    "/icon-512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {

    const url = event.request.url;

    // ❌ ne pas cacher API
    if (url.includes("supabase") || url.includes("/api")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {

                // seulement GET
                if (event.request.method !== "GET") return response;

                const clone = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });

                return response;
            }).catch(() => {
                if (event.request.destination === "document") {
                    return caches.match("/");
                }
            });
        })
    );
});