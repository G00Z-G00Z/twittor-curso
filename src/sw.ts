// Imports 

importScripts("js/sw-utils.js")

const scope = (self as unknown) as ServiceWorkerGlobalScope

const CACHE_NAME: {
    readonly static: string,
    readonly dynamic: string,
    readonly inmutable: string
} = {
    static: "static-v1",
    dynamic: "dynamic-v1",
    inmutable: "inmutable-v1"
}

const APP_SHELL = [
    "/",
    "index.html",
    "js/app.js",
    "js/sw-utils.js",
    "css/style.css",
    "img/favicon.ico",
    "img/avatars/hulk.jpg",
    "img/avatars/ironman.jpg",
    "img/avatars/spiderman.jpg",
    "img/avatars/thor.jpg",
    "img/avatars/wolverine.jpg",
]

const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js"

]


async function addFilesToCache(cacheName: string, requests: string[]) {
    const cache = await caches.open(cacheName)
    await cache.addAll(requests)
}

function swLog(cualquierCosa: any) {
    console.log("SW: ", cualquierCosa)
}

async function erasePrevCache() {

    const allCachesNames = await caches.keys()

    const { static: staticCache, inmutable, dynamic } = CACHE_NAME

    allCachesNames
        .filter(name =>
            !(
                name === staticCache ||
                name === inmutable ||
                name === dynamic
            ))
        .forEach(name => {
            caches.delete(name)
        });
}




scope.addEventListener("install", (e) => {
    scope.skipWaiting()
    swLog("Instalando los archivos")
    e.waitUntil(Promise.all([
        addFilesToCache(CACHE_NAME.static, APP_SHELL),
        addFilesToCache(CACHE_NAME.inmutable, APP_SHELL_INMUTABLE)
    ]))
    swLog("Terminado de instalar los archivos")
})

scope.addEventListener("activate", (e) => {

    e.waitUntil(Promise.all([
        erasePrevCache()
    ]))
})

scope.addEventListener('fetch', e => {

    const { request } = e

    const checkResponseAndAnswer = async () => {

        let resp = await caches.match(request)

        if (resp)
            return resp

        resp = await fetch(request)
        return actualizarCacheDinamico(CACHE_NAME.dynamic, request, resp)

    }


    e.respondWith(checkResponseAndAnswer())

});