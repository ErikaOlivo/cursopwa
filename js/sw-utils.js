
// Guardar en el cache dinamico
function actualizarCacheDinamico(dynamicCache, req, res) {

    if (res.ok) {
        //Quiere decir que la respuesta tiene data
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res.clone());
            limpiarCache(dynamicCache, 50); // Máximo 50 items en cache dinámico
            return res.clone();
        });
    } else {
        //Puede retornar un error de conexión 404, 500, etc
        return res;
    }

}

// Limpiar cache dinámico para evitar crecimiento ilimitado
function limpiarCache(cacheName, numeroItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(() => limpiarCache(cacheName, numeroItems));
                    }
                });
        });
}
