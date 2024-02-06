// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  puestoTrabajoGet,
} = require("../../controllers/catalogos/puestoTrabajo-controller");
const { validarCampos } = require("../../middlewares/validar-campos");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PUESTOS DE TRABAJO
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    validarCampos,
  ],
  puestoTrabajoGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
