// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  existeEmpleadoPorId,
  existeDiaPorId,
  existeEntradaSalidaPorId,
  existeEventoPorId,
  emailExistente,
} = require("../../helpers/db-validators");
const {
  registroChequeoGet,
  registroChequeoPost,
  notificarNoChequeoPost,
  reportePost,
  reporteEventosYTiempoPost,
} = require("../../controllers/catalogos/registroChequeo-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", registroChequeoGet);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post("/datos", reportePost);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post("/reporte", reporteEventosYTiempoPost);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    check("fecha", "Formato de fecha incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("hora", "Formato de hora incorrecto").custom((value) => {
      return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
    }),
    check("evento").custom(existeEventoPorId),
    check("id_empleado").custom(existeEmpleadoPorId),
    check("dia").custom(existeDiaPorId),
    check("entrada_salida").custom(existeEntradaSalidaPorId),
    validarCampos,
  ],
  registroChequeoPost
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/notificar",
  [
    // VALIDACIONES PARA LOS DATOS DE INICIO DE SESIÓN
    check("correo", "El correo es obligatorio").isEmail(),
    check("correo").custom(emailExistente),
    validarCampos,
  ],
  notificarNoChequeoPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
