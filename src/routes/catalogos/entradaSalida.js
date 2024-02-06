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
const { validarJWT } = require("../../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tieneRole("FROND END", "BACK END"),
    //esAdminRole,
    check("empleados").custom(existenEmpleadosPorId),
    validarCampos,
  ],
  entradaSalidaPost
);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post(
  "/datos",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    validarCampos,
  ],
  reporteEntradasSalidasPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
