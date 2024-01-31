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

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS
router.get("/", permisoGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/solicitados", permisosGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    check("fecha_permiso", "Formato de fecha incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("tiempo_horas", "El tiempo_horas debe ser un numero.")
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
    check("estatus", "El estatus debe ser un numero entre 0 y 2")
      .isNumeric()
      .isInt({ min: 0, max: 2 }),
    check("id_cat_permiso").custom(existePermisoPorId),
    // MIDDLEWARE PARA VALIDAR CAMPOS
    validarCampos,
  ],
  permisoPut
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
