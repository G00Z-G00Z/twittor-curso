function actualizarCacheDinamico(cacheName: string, req: Request, res: Response) {

    if (!res.ok)
        return res

    caches.open(cacheName)
        .then(cache => {
            cache.put(req, res.clone())
        })

    return res.clone()

}