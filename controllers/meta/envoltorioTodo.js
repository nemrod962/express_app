/**Modelo de Mongoose que emplearan todas las funciones llamadas desde envoltorio.
 * En este caso, ModeloClima.
 */
var path = require('path');
var ModeloClima = require(path.resolve(__dirname, path.join(process.cwd(), 'models', 'weather.js')));

/**Funcion envoltorio.
 * Recibirá como parámetros:
 * -> El campo(s) separados por espacios que empleará la
 * función.
 * -> La función que deberá aplicar 
 * a los datos para obtenerun resultado (p.ej: mediaLluvia).
 * -> Necesita también la respuesta como parámetro, ya que dentro
 * de modeloMongoose.find().exec(function(){
 * ...
 * });
 * es asíncrono y tengo que devolver el resultado
 * de las operaciones con respuesta.send().
 * -> Filtro para filtrar todos los documentos obtenidos.
 * Si se omite no se filtrarán los resultados obtenidos, o
 * sea, que se emplearán todos los documentos en MongoDB.
 */
module.exports = {
    envoltorio :function(campo, funcion, respuesta, filtro={})
    {
        //Si el campo "dia" no se encuentra dentro de la cadena 'campos' lo 
        //añadimos, ya que emplearemos el campo dia (contiene la fecha) para
        //aplicar filtros por fechas.
        if(String(campo).indexOf("dia") == -1)
        {
            campo += " dia"
        }
        console.log("FILTRO: ");
        console.log(filtro);
        ModeloClima
            //campo = probLluvia
            //~ .find(filtro).select{probLluvia : 1}.exec(function(datos){...})
            .find(filtro, campo,{sort: {dia: 1}}, function(err,datos)
            {
                if (err)
                {
                    console.log("ERROR: " + err);
                    return err;
                }
                console.log("DATOS: " + datos);
                //datos es un array con los objetos retornados por find
                
                //Pasamos como parámetro solo el primer campo en caso
                //de que se hayan especificado varios separados por espacios
                var resultadoOP = funcion(datos, campo.split(" ")[0]);

                //Añado descripcion
                //Obtengo el nombre de la operacion realizada
                var nombreOperacion = String(funcion).split(/[ (]/)[1];
                //Elimino la subcadena "Weather"
                nombreOperacion = nombreOperacion.replace(/weather/i,"");
                //Obtengo el campo utilizado enel cálculo de la operación
                var nombreCampo = campo.split(" ")[0];
                //Compongo descripción completa.
                var descripcion = nombreOperacion
                +" "+nombreCampo
                +" "+"global";

                //Metemos resultado en json
                var res = {"label" : descripcion
                ,"data" : resultadoOP};
                console.log("RES ENVOLTORIO: " + res);
                respuesta.send(res);
            });
    }
}