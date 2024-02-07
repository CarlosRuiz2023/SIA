// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  existeEmpleadoPorId,
  existeEntradaSalidaPorId,
  existeEventoPorId,
  emailExistente,
  existenEmpleadosPorId,
} = require("../../helpers/db-validators");
const {
  registroChequeoGet,
  registroChequeoPost,
  notificarNoChequeoPost,
  reportePost,
  reporteEventosYTiempoPost,
  reporteEventosEmpleadoPost,
} = require("../../controllers/catalogos/registroChequeo-controller");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Entradas y salidas";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  registroChequeoGet
);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post(
  "/datos",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("empleados").custom(existenEmpleadosPorId),
    validarCampos,
  ],
  reportePost
);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post(
  "/reporte",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("tipo", "El tipo debe ser un numero entre 1 y 4")
      .isNumeric()
      .isInt({ min: 1, max: 4 }),
    validarCampos,
  ],
  reporteEventosYTiempoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post(
  "/reporteEmpleado",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id_empleado").custom(existeEmpleadoPorId),
    validarCampos,
  ],
  reporteEventosEmpleadoPost
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("evento").custom(existeEventoPorId),
    check("id_empleado").custom(existeEmpleadoPorId),
    check("entrada_salida").custom(existeEntradaSalidaPorId),
    validarCampos,
  ],
  registroChequeoPost
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/notificar",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    validarCampos,
  ],
  notificarNoChequeoPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
