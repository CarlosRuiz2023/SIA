// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  eventosGet,
} = require("../../controllers/catalogos/eventos-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LOS EVENTOS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    validarCampos,
  ],
  eventosGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
