﻿//elementos basicos
var path = require('path');
var app = require(path.join(process.cwd(), 'server'));
var fs = require('fs');
var glob = require('glob');


//este es el proceso encargado de establecer los controladores y asignarlos a su carpeta
var controllers = {};
var files = glob.sync(path.join(process.cwd(), 'controllers', '**', '*.js'));
//DEBUG
console.log("FILES: " + files);
files.forEach(function (file) {
    var temp = controllers;
    console.log("temp: " + temp);
    var parts = path.relative(path.join(process.cwd(), 'controllers'), file).slice(0, -3).split(path.sep);
    console.log("parts: " + parts);

    while (parts.length) {
        if (parts.length === 1) {
            temp[parts[0]] = require(file);
        } else {
            temp[parts[0]] = temp[parts[0]] || {};
        }
        temp = temp[parts.shift()];
    }
});
//DEBUG
for (i in controllers)
{
    console.log("CONTROLLER " + i + ": " + controllers[i]);
}
console.log("WIKI: " + controllers.db_worker);
console.log("WIKI.HOME: " + controllers.db_worker.getData);
console.log("WIKI.ABOUT: " + controllers.db_worker.setData);

//Proceso para asociar las peticiones a los métodos del controlador
module.exports = function () {
    //añadimos el index
    //app.route('/').get(controllers.main.main);
    
    /*Podemos asignar tantas rutas como queramos, incluyendo parámetros, middleware y todo lo que Express soporte.Algunos ejemplos:
    app.route('/:id').get(controllers.users.show);
    app.route('/admin').get(auth.check, controllers.admin.main);
    app.route('/admin/edit/:id').get(auth.check, controllers.admin.edit);*/
    
    /*Pruebas*/

    /*Lo aceptable.*/
    app.route('/').get(controllers.wiki.home);
    app.route('/about').get(controllers.wiki.about);
    app.route('/test').get(controllers.test.testFunc);
    app.route('/ang').get(controllers.test.testAng);
    //No funciona. testFunc2() no esta declarado (undefined)
    //app.route('/test2').get(controllers.test.testFunc2);

    //DB
    app.route('/db').get(controllers.db_worker.getData);
    //app.route('/db').post(controllers.db_worker.setData);
    //app.route('/db/render').get(controllers.db_worker.renderDBTemplate);

    app.route('/weather').get(controllers.db_worker_weather.getData);
    app.route('/weather').post(controllers.db_worker_weather.setData);
    app.route('/weather').delete(controllers.db_worker_weather.clearData);
    //
    app.route('/reset').get(controllers.db_weather_filler.resetDB);

    

    /*FIN PRUEBAS*/

    /*Errores*/
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        return res.status(500).render('errores/500');
    });

    app.use(function (req, res) {
        return res.status(404).render('errores/404');
    });
}