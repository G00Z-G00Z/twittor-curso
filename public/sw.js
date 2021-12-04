"use strict";
// Imports 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
importScripts("js/sw-utils.js");
const scope = self;
const CACHE_NAME = {
    static: "static-v1",
    dynamic: "dynamic-v1",
    inmutable: "inmutable-v1"
};
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
];
const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js"
];
function addFilesToCache(cacheName, requests) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = yield caches.open(cacheName);
        yield cache.addAll(requests);
    });
}
function swLog(cualquierCosa) {
    console.log("SW: ", cualquierCosa);
}
function erasePrevCache() {
    return __awaiter(this, void 0, void 0, function* () {
        const allCachesNames = yield caches.keys();
        const { static: staticCache, inmutable, dynamic } = CACHE_NAME;
        allCachesNames
            .filter(name => !(name === staticCache ||
            name === inmutable ||
            name === dynamic))
            .forEach(name => {
            caches.delete(name);
        });
    });
}
scope.addEventListener("install", (e) => {
    scope.skipWaiting();
    swLog("Instalando los archivos");
    e.waitUntil(Promise.all([
        addFilesToCache(CACHE_NAME.static, APP_SHELL),
        addFilesToCache(CACHE_NAME.inmutable, APP_SHELL_INMUTABLE)
    ]));
    swLog("Terminado de instalar los archivos");
});
scope.addEventListener("activate", (e) => {
    e.waitUntil(Promise.all([
        erasePrevCache()
    ]));
});
scope.addEventListener('fetch', e => {
    const { request } = e;
    const checkResponseAndAnswer = () => __awaiter(void 0, void 0, void 0, function* () {
        let resp = yield caches.match(request);
        if (resp)
            return resp;
        resp = yield fetch(request);
        return actualizarCacheDinamico(CACHE_NAME.dynamic, request, resp);
    });
    e.respondWith(checkResponseAndAnswer());
});
//# sourceMappingURL=sw.js.map