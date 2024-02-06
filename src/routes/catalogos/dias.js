// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const { diasGet } = require("../../controllers/catalogos/dias-controller");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");
const { validarCampos } = require("../../middlewares/validar-campos");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tieneRole("FROND END", "BACK END"),
    //esAdminRole,
    validarCampos,
  ],
  diasGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
