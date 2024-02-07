/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// CARGA LAS VARIABLES DE ENTORNO DESDE EL ARCHIVO .env
require("dotenv").config();

// IMPORTA LA CLASE SCHEDULE
const schedule = require("node-schedule");

// IMPORTA LA CLASE SERVER DESDE EL ARCHIVO ESPECIFICADO
const Server = require("./src/models/server");
const {
  registrarAusencia,
} = require("./src/controllers/catalogos/ausencias-controller");

// CREA UNA INSTANCIA DE LA CLASE SERVER
const server = new Server();

// Programar la tarea para que se ejecute todos los días a las 10:30
schedule.scheduleJob("30 10 * * *", registrarAusencia);

// INICIA EL SERVIDOR, HACIENDO QUE ESCUCHE EN EL PUERTO ESPECIFICADO
server.listen();
