"use strict";
function actualizarCacheDinamico(cacheName, req, res) {
    if (!res.ok)
        return res;
    caches.open(cacheName)
        .then(cache => {
        cache.put(req, res.clone());
    });
    return res.clone();
}
//# sourceMappingURL=sw-utils.js.map