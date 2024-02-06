// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  vacacionesGet,
} = require("../../controllers/catalogos/vacaciones-controller");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS VACACIONES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
  ],
  vacacionesGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
