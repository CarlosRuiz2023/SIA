// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  actividadesGet,
  actividadesPost,
  actividadIdGet,
  actividadPut,
  actividadDelete,
  reporteActividadesPost,
} = require("../../controllers/catalogos/actividades-controller");
const {
  existeActividadPorId,
  existeEquipoTrabajoPorId,
} = require("../../helpers/db-validators");
const { esAdminRole, tieneRole } = require("../../middlewares/validar-roles");
const { validarJWT } = require("../../middlewares/validar-jwt");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tieneRole("FROND END", "BACK END"),
    //esAdminRole,
    validarCampos,
  ],
  actividadesGet
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("equipo_trabajo").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  actividadesPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tieneRole("FROND END", "BACK END"),
    //esAdminRole,
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  actividadIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    tieneRole("FROND END", "BACK END"),
    //esAdminRole,
    check("id").custom(existeActividadPorId),
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    check("equipo_trabajo").custom(existeEquipoTrabajoPorId),
    validarCampos,
  ],
  actividadPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("id").custom(existeActividadPorId),
    validarCampos,
  ],
  actividadDelete
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/reporte/",
  [
    // VALIDACIONES PARA LOS DATOS DE AGREGAR UN ACCESO
    validarJWT,
    //tieneRole("FROND END", "BACK END"),
    esAdminRole,
    check("fecha_inicio", "Formato de fecha_inicio incorrecto").custom(
      (value) => {
        return /\d{4}-\d{2}-\d{2}/.test(value);
      }
    ),
    check("fecha_fin", "Formato de fecha_fin incorrecto").custom((value) => {
      return /\d{4}-\d{2}-\d{2}/.test(value);
    }),
    check("id", "El tipo debe ser un numero").isNumeric(),
    check("tipo", "El tipo debe ser un numero entre 1 y 3")
      .isNumeric()
      .isInt({ min: 1, max: 3 }),
    validarCampos,
  ],
  reporteActividadesPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
