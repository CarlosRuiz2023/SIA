/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const express = require("express"); // Biblioteca para crear el servidor web
const cors = require("cors"); // Middleware para manejar CORS (Cross-Origin Resource Sharing)

// IMPORTACIÓN DE LA CONFIGURACIÓN DE LA BASE DE DATOS POSTGRESQL DESDE OTRO ARCHIVO
const pool = require("../database/config");

// IMPORTACIÓN DE LAS RUTAS RELACIONADAS CON LA AUTENTICACIÓN
const { InicioSesionRuta } = require("../routes/autenticacion/inicio-sesion");

// IMPORTACIÓN DE LAS RUTAS RELACIONADAS CON LOS CATÁLOGOS
const { EmpleadosRuta } = require("../routes/catalogos/empleado");

// CLASE QUE REPRESENTA EL SERVIDOR
class Server {
  // CONSTRUCTOR DE LA CLASE
  constructor() {
    // CREA UNA INSTANCIA DE EXPRESS PARA MANEJAR EL SERVIDOR
    this.app = express();
    // CONFIGURA EL PUERTO DEL SERVIDOR, UTILIZA EL PUERTO ESPECIFICADO EN LAS VARIABLES DE ENTORNO O EL PUERTO 3000 POR DEFECTO
    this.port = process.env.PORT || 3000;

    // RUTA BASE PARA LAS RUTAS RELACIONADAS CON LA AUTENTICACIÓN
    this.autenticacionPath = {
      catalogoAutenticacion: "/api/usuario",
    };
    // RUTAS BASE PARA LOS CATÁLOGOS
    this.catalogosPath = {
      catalogoEmpleado: "/api/empleado",
      catalogoCliente: "/api/cliente",
      catalogoPuestoTrabajo: "/api/puestoTrabajo",
      catalogoVacaciones: "/api/vacaciones",
      catalogoTolerancia: "/api/tolerancia",
      catalogoRoles: "/api/roles",
      catalogoPermiso: "/api/permiso",
      catalogoModulo: "/api/modulo",
      catalogoBitacoraAcceso: "/api/bitacoraAcceso",
      catalogoDias: "/api/dias",
      catalogoEntradaSalida: "/api/entradaSalida",
      catalogoTipoHorario: "/api/tipoHorario",
      catalogoRegistroChequeo: "/api/registroChequeo",
      catalogoEventos: "/api/eventos",
      catalogoPermisos: "/api/permisos",
      catalogoAusencias: "/api/ausencias",
      catalogoEquipoTrabajo: "/api/equipoTrabajo",
      catalogoActividades: "/api/actividades",
      catalogoProyectos: "/api/proyectos",
    };

    // CONEXIÓN A LA BASE DE DATOS DE POSTGRESQL
    this.conectarDB();

    // CONFIGURACIÓN DE MIDDLEWARES
    this.middlewares();

    // CONFIGURACIÓN DE RUTAS DEL SISTEMA
    this.routes();
  }

  // FUNCIÓN PARA REALIZAR LA CONEXIÓN A LA BASE DE DATOS DE POSTGRESQL
  async conectarDB() {
    await pool;
  }

  // CONFIGURACIÓN DE LOS MIDDLEWARES DEL SERVIDOR
  middlewares() {
    // MIDDLEWARE PARA MANEJAR CORS
    this.app.use(
      cors({
        origin: ["http://localhost:4200", "http://192.168.40.1:5985"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    );

    // MIDDLEWARE PARA MANEJAR SOLICITUDES Y RESPUESTAS EN FORMATO JSON
    this.app.use(express.json());

    // MIDDLEWARE PARA SERVIR ARCHIVOS ESTÁTICOS DESDE LA CARPETA 'public'
    this.app.use(express.static("public"));
  }

  // CONFIGURACIÓN DE LAS RUTAS DEL SISTEMA
  routes() {
    this.app.use(
      this.autenticacionPath.catalogoAutenticacion,
      require("../routes/autenticacion/inicio-sesion")
    );
    this.app.use(
      this.catalogosPath.catalogoEmpleado,
      require("../routes/catalogos/empleado")
    );
    this.app.use(
      this.catalogosPath.catalogoCliente,
      require("../routes/catalogos/cliente")
    );
    this.app.use(
      this.catalogosPath.catalogoPuestoTrabajo,
      require("../routes/catalogos/puestoTrabajo")
    );
    this.app.use(
      this.catalogosPath.catalogoVacaciones,
      require("../routes/catalogos/vacaciones")
    );
    this.app.use(
      this.catalogosPath.catalogoTolerancia,
      require("../routes/catalogos/tolerancia")
    );
    this.app.use(
      this.catalogosPath.catalogoRoles,
      require("../routes/catalogos/roles")
    );
    this.app.use(
      this.catalogosPath.catalogoPermiso,
      require("../routes/catalogos/permiso")
    );
    this.app.use(
      this.catalogosPath.catalogoModulo,
      require("../routes/catalogos/modulo")
    );
    this.app.use(
      this.catalogosPath.catalogoBitacoraAcceso,
      require("../routes/catalogos/bitacoraAccesos")
    );
    this.app.use(
      this.catalogosPath.catalogoDias,
      require("../routes/catalogos/dias")
    );
    this.app.use(
      this.catalogosPath.catalogoEntradaSalida,
      require("../routes/catalogos/entradaSalida")
    );
    this.app.use(
      this.catalogosPath.catalogoTipoHorario,
      require("../routes/catalogos/tipoHorario")
    );
    this.app.use(
      this.catalogosPath.catalogoRegistroChequeo,
      require("../routes/catalogos/registroChequeo")
    );
    this.app.use(
      this.catalogosPath.catalogoEventos,
      require("../routes/catalogos/eventos")
    );
    this.app.use(
      this.catalogosPath.catalogoPermisos,
      require("../routes/catalogos/permisos")
    );
    this.app.use(
      this.catalogosPath.catalogoAusencias,
      require("../routes/catalogos/ausencias")
    );
    this.app.use(
      this.catalogosPath.catalogoEquipoTrabajo,
      require("../routes/catalogos/equipoTrabajo")
    );
    this.app.use(
      this.catalogosPath.catalogoActividades,
      require("../routes/catalogos/actividades")
    );
    this.app.use(
      this.catalogosPath.catalogoProyectos,
      require("../routes/catalogos/proyectos")
    );
  }

  // FUNCIÓN PARA INICIAR EL SERVIDOR Y ESCUCHAR EN EL PUERTO ESPECIFICADO
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto ", this.port);
    });
  }
}

// EXPORTA LA CLASE SERVER PARA PODER UTILIZARLA EN OTROS ARCHIVOS
module.exports = Server;
