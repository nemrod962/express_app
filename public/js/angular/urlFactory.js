/**Servicio (Factory) para trabajar con strings que contengan
 * URLs y parsearlas. Al ser un servicio puede ser accedido
 * por diferentes controladores.
 */
app.factory('urlService', function()
{
    var factory = {};


    //------------------------------------------------------------------
    /*
     _   _ ____  _         
    | | | |  _ \| |    ___ 
    | | | | |_) | |   / __|
    | |_| |  _ <| |___\__ \
     \___/|_| \_\_____|___/
                        
    */
    //URLS

    //Variables locales. Cuando una petición
    //sea local, se emplearán este hostname ç
    //y este puerto.
    //Hostname
    factory.localHost = window.location.hostname;
    //Puerto
    factory.localPort = window.location.port;

    /**Para parsear una cadena y sacar info si es URL */
    factory.parseURL = function(href) {
        var match = href.match(/^(https?\:\/\/)?(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        var data = {
            href: href,
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7]
            //Los relevantes en mi caso
            //son hostname, port y pathname
            //hostname + port = host
            //host + pathname = miUrl
        };

        return data;
    }

    /**Recibe la salida de la funcion parseURL y añade campos si faltan */
    factory.fixURLData = function(data)
    {
        //Tengo que añadir 'http://' para que el post se envía
        //a otra máquina (cross domain POST).
        //http://192.168.1.38:3000/ops/mediaLluvia -> Se envia POST correctamente
        //192.168.1.38:3000/ops/mediaLluvia -> Se envia POST a  localhost:3000/192.168.1.38:3000/ops/mediaLluvia
        //Compruebo si hay campos vacios.
        //Si no se especifica protocolo doy por sentado que es http
        if(data['protocol']==undefined || data['protocol']=='')
        {
            data.protocol='http://';
        }
        //Si no se especifica hostname doy por sentado que es localhost
        if(data['hostname']==undefined || data['hostname']=='')
        {
            //data['hostname']='localhost';
            data['hostname']=factory.localHost;
        }
        //Si no se especifica puerto doy por sentado que es 80
        if(data['port']==undefined || data['port']=='')
        {
            //data['port']='3000';
            data['port']=factory.localPort;
        }
        data['host']= data['hostname'];
        if(data['port']!='')
        {
            data['host']+=':'+data['port'];
        }

        return data;
    }

    /**Envoltorio de las dos funcione sprevias */
    factory.checkURL = function(url)
    {
        var data = factory.parseURL(url);
        data = factory.fixURLData(data);
        
        return data;
    }

    /**Función que determina si una url se refiere a
     * la máquina local o no. SImplemente
     * compruebo si el hostname es 'localhost'
     */
    factory.isLocalUrl = function(url)
    {
        var urlData = factory.parseURL(url);
        //return urlData['hostname']=='localhost';
        return urlData['hostname']==factory.localHost;
    }

    /**Dado una url como un objecto, devuelve una cadena
     * con los datos de la URL.
     */
    factory.urlToString = function(url)
    {
        console.log("heyo: " + url);
        var cadena = url['protocol']+url['host']+url['pathname']+url['search'];
        console.log("cad: " + cadena);
        return cadena;
    }

    /**Transforma la url indicada en una url a localhost en el puerto 3000.*/
    factory.urlToLocal = function(url)
    {
        //Copio el objeto url recibido de forma que obtengo
        //uno nuevo en el que puedo realizar cambios sin 
        //alterar el original
        var localUrl = Object.assign({},url);
        //realizo cambios en la copia
        //localUrl['hostname']='localhost';
        localUrl['hostname']=factory.localHost;
        //localUrl['port']='3000';
        localUrl['port']=factory.localPort;
        localUrl['host']= localUrl['hostname'];
        if(localUrl['port']!='')
        {
            localUrl['host']+=':'+localUrl['port'];
        }
        //retorno la copia
        return localUrl;
    }

    return factory;
});