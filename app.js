/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa la clase Server desde el archivo especificado
const Server = require('./src/models/server');

// Crea una instancia de la clase Server
const server = new Server();

// Inicia el servidor, haciendo que escuche en el puerto especificado
server.listen();
