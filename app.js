/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// CARGA LAS VARIABLES DE ENTORNO DESDE EL ARCHIVO .env
require('dotenv').config();

// IMPORTA LA CLASE SERVER DESDE EL ARCHIVO ESPECIFICADO
const Server = require('./src/models/server');

// CREA UNA INSTANCIA DE LA CLASE SERVER
const server = new Server();

// INICIA EL SERVIDOR, HACIENDO QUE ESCUCHE EN EL PUERTO ESPECIFICADO
server.listen();
