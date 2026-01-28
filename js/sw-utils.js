
// Guardar en el cache dinamico
function actualizarCacheDinamico( dynamicCache, req, res ) {

    if ( res.ok ){
      //Quiere decir que la respuesta tiene data
        return caches.open( dynamicCache ).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    } else {
        //Puede retornar un error de conexión 404, 500, etc
        return res;
    }

} 
