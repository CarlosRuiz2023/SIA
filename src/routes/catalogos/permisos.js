// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIONES DE MIDDLEWARES Y DE CONTROLADORES
const { validarCampos } = require("../../middlewares/validar-campos");

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const {
  permisoGet,
  permisosGet,
  permisoPost,
  permisoIdGet,
  permisosIdGet,
  permisoPut,
} = require("../../controllers/catalogos/permisos-controller");
const {
  existePermisoPorId,
  existePermisoEmpleadoPorId,
  existeEmpleadoPorId,
} = require("../../helpers/db-validators");
const { validarJWT } = require("../../middlewares/validar-jwt");
const { tienePermiso } = require("../../middlewares/validar-roles");

// CREACIÓN DEL ENRUTADOR
const router = Router();

const sub_modulo = "Permisos";

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  permisoGet
);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/solicitados",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    validarCampos,
  ],
  permisosGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Escribir", sub_modulo),
    check("fecha_permiso", "Formato de fecha incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("tiempo_horas", "El tiempo_horas debe ser un numero entre 1 y 4")
      .isNumeric()
      .isInt({ min: 1, max: 4 }),
    check("id_cat_empleado").custom(existeEmpleadoPorId),
    check("id_cat_permiso").custom(existePermisoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  permisoPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existePermisoEmpleadoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  permisoIdGet
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/solicitados/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Leer", sub_modulo),
    check("id").custom(existeEmpleadoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  permisosIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tienePermiso("Modificar", sub_modulo),
    check("estatus", "El estatus debe ser un numero entre 0 y 4")
      .isNumeric()
      .isInt({ min: 0, max: 4 }),
    check("id_cat_permiso").custom(existePermisoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  permisoPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
