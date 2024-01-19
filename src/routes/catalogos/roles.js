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

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER ROLES CON PERMISOS
router.get("/rolPermiso/", rolesGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS ROLES
router.get("/", rolesTodosGet);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR PERMISOS DE ROLES
router.put(
  "/",
  [
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
