// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const {
  eventosGet,
} = require("../../controllers/catalogos/eventos-controller");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    validarCampos,
  ],
  eventosGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
