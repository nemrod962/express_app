var mongoose = require('mongoose');
//lista con las direcciones del viento
//var path = require('path');
//var direccionesViento = require(path.resolve(__dirname, path.join(process.cwd(), 'models', 'direccionesViento.js')));
//console.log('DIRECCIONES: ' + direccionesViento);
//defino Schema 
var Schema = mongoose.Schema

var weatherSchema = new Schema(
{
        //Dia de la toma de medidas (fecha)
        //Date.now() -> fecha en ms
        //Obtener dia: 
        //var t = Date.now()
        //var f = new Date(t)
        //var dia = f.getDate()
        //var mes = f.getMonth()
        //var anio = f.getFullYear()
        //Para crear objeto Date() para un año determinaod
        //var miAnio = new Date("2018")

        dia: {
            type: Date,
            required: true,
            default: Date.now
        },
        //Probabilidad de precipitaciones.
        //de 0 a 100 (porcentaje)
        probLluvia: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100
        },
        //Precipitaciones (litros/m²)
        precipitaciones: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 300
        },
        //Humedad relativa.
        //de 0 a 100 (porcentaje)
        humedad: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100
        },
        //Velocidad del viento en
        //km/h. Min 0 max 999
        velViento: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 999
        },
        //Temperatura.
        //-40 - 60
        temp:{
            type: Number,
            required: true,
            default: 0,
            min: -40,
            max: 60
        },
        //Presión atmosférica en hectopascales (hPa)
        //940 - 1050
        presion: {
            type: Number,
            required: true,
            default: 0,
            min: 940,
            max: 1050
        }
});

//compilar modelo a partir del schema
var modeloClima = mongoose.model('modeloClima',weatherSchema);
//Exporto modelo
module.exports = modeloClima;