/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// Importa el paquete pg, que es un cliente PostgreSQL para Node.js
const { Pool } = require("pg");

const Sequelize = require('sequelize');

const database = process.env.NAME_DATABASE;
const username = process.env.USER_NAME_DATABASE;
const password = process.env.PASSWORD_DATABASE;
const host = process.env.SERVER_DATABASE;

const pool = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
});

(async () => {
  try {
    await pool.authenticate();
    console.log('La conexión de la base de datos ha sido exitosa.');
  } catch (error) {
    console.error('Ha ocurrido un error al hacer conexión con la Base de Datos:', error);
  }
})();

module.exports = pool;



// // Crea una nueva instancia de Pool, que se utiliza para gestionar conexiones a la base de datos
// const pool = new Pool({
//     // Configuración de la conexión utilizando variables de entorno
//     host: process.env.SERVER_DATABASE,        // Dirección del servidor de la base de datos
//     user: process.env.USER_NAME_DATABASE,    // Nombre de usuario para la conexión
//     password: process.env.PASSWORD_DATABASE, // Contraseña para la conexión
//     database: process.env.NAME_DATABASE, // Nombre de la base de datos
//     port: (process.env.PORT_DATABASE || 3306), // Puerto del servidor de la base de datos, predeterminado es 3306 para MySQL
// });

// // Intenta conectar con la base de datos
// pool.connect((err, res) => {
//     if (err) {
//         // Si hay un error durante la conexión, imprime un mensaje de error y los detalles del error
//         console.log("Ha ocurrido un error al hacer conexión con la Base de Datos.");
//         console.log(err);
//     } else {
//         // Si la conexión es exitosa, imprime un mensaje de éxito
//         console.log("La conexión de la base de datos ha sido exitosa.");
//     }
// });

// // Exporta la instancia del Pool para que pueda ser utilizada en otros archivos
// module.exports = pool;


