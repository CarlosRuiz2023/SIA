// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  reporteEntradasSalidasPost,
  entradaSalidaPost,
} = require("../../controllers/catalogos/entradaSalida-controller");
const { validarCampos } = require("../../middlewares/validar-campos");
const { existenEmpleadosPorId } = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.post(
  "/",
  [check("empleados").custom(existenEmpleadosPorId), validarCampos],
  entradaSalidaPost
);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post("/datos", reporteEntradasSalidasPost);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
