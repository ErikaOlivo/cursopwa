
// Importamos la función para actualizar el cache dinámico
// import { actualizarCacheDinamico } from 'js/sw-utils.js';
importScripts('js/sw-utils.js');


const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v4';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
];


const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400&family=Lato:wght@300;400&display=swap',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => {
      cache.addAll(APP_SHELL);
    });

  const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => {
      cache.addAll(APP_SHELL_INMUTABLE);
    });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', e => {

  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key);
      }
    });

  });

  e.waitUntil(respuesta);

});


self.addEventListener('fetch', e => {

  const respuesta = caches.match(e.request)
    .then(res => {
      if (res) {
        // Cache First: retornar inmediatamente desde cache
        return res;
      }

      // Si no está en cache, fetch y guardar
      return fetch(e.request)
        .then(newRes => {
          // Solo cachear respuestas exitosas
          if (!newRes || newRes.status !== 200 || newRes.type === 'error') {
            return newRes;
          }

          return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
        })
        .catch(err => {
          // Fallback para imágenes offline
          if (e.request.destination === 'image') {
            return caches.match('img/favicon.ico');
          }
        });
    });

  e.respondWith(respuesta);
});