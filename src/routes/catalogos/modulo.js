// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const {
  modulosGet,
  subModulosGet,
  modulosSubModulosGet,
} = require("../../controllers/catalogos/modulos-controller");
const { validarCampos } = require("../../middlewares/validar-campos");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS MÓDULOS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    validarCampos,
  ],
  modulosGet
);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS SUBMÓDULOS
router.get(
  "/subModulos/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    validarCampos,
  ],
  subModulosGet
);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS MÓDULOS CON SUS SUBMÓDULOS
router.get(
  "/modulosSubModulos/",
  [
    // VALIDACIONES PARA LOS DATOS DE ACCESO
    validarJWT,
    validarCampos,
  ],
  modulosSubModulosGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
