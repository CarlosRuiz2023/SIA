// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const {
  permisosGet,
  permisoSubModuloGet,
} = require("../../controllers/catalogos/permiso-controller");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { tienePermiso } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Roles y permisos";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  permisosGet
);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS CON SUS SUBMÓDULOS
router.get(
  "/permisoSubModulo/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  permisoSubModuloGet
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
