const CACHE_NAME = "vitevendu-v3";

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

// ACTIVATE (IMPORTANT: force refresh cache)
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

    if (event.request.method !== "GET") return;

    // Ne pas gérer les vidéos avec le Service Worker
    if (event.request.url.includes(".mp4")) {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then((response) => {

                // Bloque les réponses partielles 206
                if (
                    response.status === 206 ||
                    response.type === "opaque"
                ) {
                    return response;
                }

                const clone = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(
                            event.request,
                            clone
                        );
                    });

                return response;

            })

            .catch(() => {

                return caches.match(event.request)
                    .then((cachedResponse) => {

                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        return new Response(
                            "Offline",
                            {
                                status: 503,
                                statusText: "Service unavailable"
                            }
                        );

                    });

            })

    );

});