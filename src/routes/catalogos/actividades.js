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
} = require("../../controllers/catalogos/actividades-controller");
const { existeActividadPorId } = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", actividadesGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actividadesPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [check("id").custom(existeActividadPorId), validarCampos],
  actividadIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    check("id").custom(existeActividadPorId),
    check("actividad_nombre", "La actividad_nombre es obligatoria")
      .not()
      .isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actividadPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [check("id").custom(existeActividadPorId), validarCampos],
  actividadDelete
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
