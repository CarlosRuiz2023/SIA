// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const {
  rolesGet,
  rolesTodosGet,
  rolesPermisosPut,
} = require("../../controllers/catalogos/roles-controller");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  existeDetalleRolSubModuloPorId,
} = require("../../helpers/db-validators");
const { tienePermiso } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Roles y permisos";

// DEFINICIÓN DE RUTA PARA OBTENER ROLES CON PERMISOS
router.get(
  "/rolPermiso/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  rolesGet
);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS ROLES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
  ],
  rolesTodosGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR PERMISOS DE ROLES
router.put(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("id_detalle_rol_sub_modulo").custom(existeDetalleRolSubModuloPorId),
    check("estatus", "El estatus debe ser un numero entre 0 y 1")
      .isNumeric()
      .isInt({ min: 0, max: 1 }),
    validarCampos,
  ],
  rolesPermisosPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
