/* 
    ITSMARTS
    Autor: Adrián Hernández (BackEnd)
    Fecha:27/11/2023
    Sistema: SIA
*/

// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");

// IMPORTA LA CLASE SCHEDULE
const schedule = require("node-schedule");
const {
  registrarAusencia,
} = require("../controllers/catalogos/ausencias-controller");

// MIDDLEWARE PARA MANEJAR CORS (Cross-Origin Resource Sharing)
const cors = require("cors");

// IMPORTACIÓN DE LA CONFIGURACIÓN DE LA BASE DE DATOS POSTGRESQL DESDE OTRO ARCHIVO
const pool = require("../database/config");

// IMPORTACIÓN DE LAS RUTAS RELACIONADAS CON LA AUTENTICACIÓN
const InicioSesionRuta = require("../routes/autenticacion/inicio-sesion");

// IMPORTACIÓN DE LAS RUTAS RELACIONADAS CON LOS CATÁLOGOS
const EmpleadosRuta = require("../routes/catalogos/empleado");
const ActividadesRuta = require("../routes/catalogos/actividades");
const AusenciasRuta = require("../routes/catalogos/ausencias");
const BitacoraAccesosRuta = require("../routes/catalogos/bitacoraAccesos");
const ClientesRuta = require("../routes/catalogos/cliente");
const DiasRuta = require("../routes/catalogos/dias");
const EntradaSalidasRuta = require("../routes/catalogos/entradaSalida");
const EquipoTrabajoRuta = require("../routes/catalogos/equipoTrabajo");
const EtapasRuta = require("../routes/catalogos/etapas");
const EventosRuta = require("../routes/catalogos/eventos");
const ModulosRuta = require("../routes/catalogos/modulo");
const PermisoRuta = require("../routes/catalogos/permiso");
const PermisosRuta = require("../routes/catalogos/permisos");
const ProyectosRuta = require("../routes/catalogos/proyectos");
const PuestoTrabajoRuta = require("../routes/catalogos/puestoTrabajo");
const RegistroChequeoRuta = require("../routes/catalogos/registroChequeo");
const RolesRuta = require("../routes/catalogos/roles");
const TareasRuta = require("../routes/catalogos/tarea");
const TipoHorarioRuta = require("../routes/catalogos/tipoHorario");
const ToleranciaRuta = require("../routes/catalogos/tolerancia");
const VacacionesRuta = require("../routes/catalogos/vacaciones");
const UploadsRuta = require("../routes/uploads");

// CLASE QUE REPRESENTA EL SERVIDOR
class Server {
  // CONSTRUCTOR DE LA CLASE
  constructor() {
    // CREA UNA INSTANCIA DE EXPRESS PARA MANEJAR EL SERVIDOR
    this.app = express();

    this.app.set("views", path.join(__dirname, "views"));
    // INDICAMOS EL MOTOR EJS
    this.app.set("view engine", "ejs");
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
      catalogoEtapas: "/api/etapa",
      catalogoTarea: "/api/tarea",
      uploads: "/api/uploads",
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
        origin: [
          "http://localhost:4200",
          "http://192.168.40.1:5985",
          "http://localhost:58498",
        ],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    );

    // MIDDLEWARE PARA MANEJAR SOLICITUDES Y RESPUESTAS EN FORMATO JSON
    this.app.use(express.json());

    // MIDDLEWARE PARA SERVIR ARCHIVOS ESTÁTICOS DESDE LA CARPETA 'public'
    this.app.use(express.static("public"));
    // FILEUPLOAD - CARGA DE ARCHIVOS
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  // CONFIGURACIÓN DE LAS RUTAS DEL SISTEMA
  routes() {
    this.app.use(
      this.autenticacionPath.catalogoAutenticacion,
      InicioSesionRuta
    );
    this.app.use(this.catalogosPath.catalogoEmpleado, EmpleadosRuta);
    this.app.use(this.catalogosPath.catalogoCliente, ClientesRuta);
    this.app.use(this.catalogosPath.catalogoPuestoTrabajo, PuestoTrabajoRuta);
    this.app.use(this.catalogosPath.catalogoVacaciones, VacacionesRuta);
    this.app.use(this.catalogosPath.catalogoTolerancia, ToleranciaRuta);
    this.app.use(this.catalogosPath.catalogoRoles, RolesRuta);
    this.app.use(this.catalogosPath.catalogoPermiso, PermisoRuta);
    this.app.use(this.catalogosPath.catalogoModulo, ModulosRuta);
    this.app.use(
      this.catalogosPath.catalogoBitacoraAcceso,
      BitacoraAccesosRuta
    );
    this.app.use(this.catalogosPath.catalogoDias, DiasRuta);
    this.app.use(this.catalogosPath.catalogoEntradaSalida, EntradaSalidasRuta);
    this.app.use(this.catalogosPath.catalogoTipoHorario, TipoHorarioRuta);
    this.app.use(
      this.catalogosPath.catalogoRegistroChequeo,
      RegistroChequeoRuta
    );
    this.app.use(this.catalogosPath.catalogoEventos, EventosRuta);
    this.app.use(this.catalogosPath.catalogoPermisos, PermisosRuta);
    this.app.use(this.catalogosPath.catalogoAusencias, AusenciasRuta);
    this.app.use(this.catalogosPath.catalogoEquipoTrabajo, EquipoTrabajoRuta);
    this.app.use(this.catalogosPath.catalogoActividades, ActividadesRuta);
    this.app.use(this.catalogosPath.catalogoProyectos, ProyectosRuta);
    this.app.use(this.catalogosPath.catalogoEtapas, EtapasRuta);
    this.app.use(this.catalogosPath.catalogoTarea, TareasRuta);
    this.app.use(this.catalogosPath.uploads, UploadsRuta);
  }

  // FUNCIÓN PARA INICIAR EL SERVIDOR Y ESCUCHAR EN EL PUERTO ESPECIFICADO
  listen() {
    // PROGRAMAR LA TAREA PARA QUE SE EJECUTE TODOS LOS DIAS A LAS 10:30
    schedule.scheduleJob("30 10 * * *", registrarAusencia);
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto ", this.port);
    });
  }
}

// EXPORTA LA CLASE SERVER PARA PODER UTILIZARLA EN OTROS ARCHIVOS
module.exports = Server;
