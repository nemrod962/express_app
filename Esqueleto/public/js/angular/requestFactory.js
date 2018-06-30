app.factory('requestService',['$http','entriesService','debugService', 'urlService',
function($http, entriesService, debugService, urlService)
{
    var factory = {};

    /*
     ____                            _       
    |  _ \ ___  __ _ _   _  ___  ___| |_ ___ 
    | |_) / _ \/ _` | | | |/ _ \/ __| __/ __|
    |  _ <  __/ (_| | |_| |  __/\__ \ |_\__ \
    |_| \_\___|\__, |\__,_|\___||___/\__|___/
                  |_|                      
    */    

    /**Wrapper */
    /**Recibo también la id de la entrada (se supone que es clave primaria), de forma que puedo
     * acceder a la entrada que le corresponde en factorys,entries para almacenar en ellas
     * los datos oportunos (respuestas local y remota).
     */
    factory.enviarPeticion = function(id,url)
    {
        var data = urlService.checkURL(url);
        //Petición Remota
        var miUrl = data['protocol']+data['host']+data['pathname'];
        factory.postdata(id,miUrl);
        //Petición Local
        var localUrl = data['protocol']+'localhost:3000'+data['pathname'];
        factory.postdata(id,localUrl);
        //Ambas respuestas se han registrado dentro de la funcion postdata().
        //Se emplean las variables factory.localResponse y factory.remoteResponse
        //para almacenar las respuestas recibidas.    
    }

    /**Envío de datos.
     * Recibe como parametros.
     * - La id de la entrada, para poder almacenar en 'entries' las
     * respuestas a sus peticiones.
     * - La url a la que enviar la peticion POST.
     */
    factory.postdata = function (id,url) 
    {
        console.log("postdata() - url: " + url);
        //Call the services 
        //$http.post('/ops/mediaLluvia')
        $http.post(url)
        .then(function onSuccess(response) 
        {
            if (response.data)
            {
                //DEBUG---
                try
                {
                    debugService.msg = "Post Data Submitted Successfully!";
                    debugService.statusval = response.status;
                    debugService.statustext = response.statusText;
                    debugService.headers = response.headers();
                    debugService.resData = response.data;
                }
                catch(err)
                {
                    console.log('DEBUG var assign err:' + err);
                }
                //---------
                factory.registrarRespuesta(id, response, factory.compararRespuestas);
            }
        },
        function onError(response) 
        {
            //DEBUG---
            try
            {
                debugService.msg = "Service not Exists";
                debugService.statusval = response.status;
                debugService.statustext = response.statusText;
                debugService.headers = response.headers();
                debugService.resData = response.data;
            }
            catch(err)
            {
                console.log('DEBUG var assign err:' + err);
            }
            //---------
            factory.registrarRespuesta(id, response, factory.compararRespuestas);
        });
    };

    /**Dependiendo de si la respuesta es a una 
     * petición a la misma máquina o a otra, 
     * registra la respuesta en una variable u otra.
     * Recibe una función callback. De esta forma,
     * puedo pasar la funcion comparar respuestas
     * opcionalmente para compararlas tras haberlas registrado.
     * Tengo que hacerlo de esta forma para que sea sincrono,
     * es decir, que se comparen las respuestas tras
     * haberlas registrado.
     */
    factory.registrarRespuesta = function(id, response, callback)
    {
        var isErrorFree = true;
        //Local o Remota
        try {
            var url = response.config.url;
        } catch (error) {
            var url = 'urlError';
            isErrorFree = false;
        }
        console.log('la url: ' + url);

        //Solo registro si la URL esta bien y no se ha producido un error.
        //Si se produce un error al hacer 'response.config.url' significa
        //que el parámetro recibido como response no es una respuesta válida
        if(isErrorFree)
        {
            if(urlService.isLocalUrl(url))
            {
                entriesService.setEntryLocalResponse(id,response);
            }
            else
            {
                entriesService.setEntryRemoteResponse(id,response);
            }
            if(typeof callback == "function")
            {
                callback(id);
            }
        }
    }

    /**Función empleada para comparar las respuestas recibidas:
     * local y remota.
     * Recibe el id de la entrada para poder obtener 
     * las respuestas que tiene almacenadas y compararlas
     */
    factory.compararRespuestas = function(id)
    {
        console.log("COMPARANDO...");
        const resp1 = JSON.stringify(entriesService.getEntryLocalResponse(id));
        const resp2 = JSON.stringify(entriesService.getEntryRemoteResponse(id));
        console.log("json resp1: " + resp1);
        console.log("json resp2: " + resp2);
        console.log("iguales: " + (resp1==resp2));
        const areRespEqual = resp1 == resp2;
        entriesService.setEntryResponseComp(id, areRespEqual);
    }


    return factory;
}]);