// IMPORTACIÓN DE LAS BIBLIOTECAS NECESARIAS
const { Router } = require("express");
const { check } = require("express-validator");

// IMPORTACIÓN DE LOS CONTROLADORES Y MIDDLEWARES NECESARIOS
const { validarCampos } = require("../../middlewares/validar-campos");
const {
  etapasGet,
  etapasPost,
  etapaIdGet,
  etapaPut,
  etapaDelete,
  etapaActividadesPost,
} = require("../../controllers/catalogos/etapas-controller");
const {
  existeEtapaPorId,
  existenActividadesPorId,
} = require("../../helpers/db-validators");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS CLIENTES
router.get("/", etapasGet);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/",
  [
    check("etapa_nombre", "La actividad_nombre es obligatoria").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  etapasPost
);

// DEFINICIÓN DE RUTA PARA OBTENER UN CLIENTE POR ID
router.get(
  "/:id",
  [check("id").custom(existeEtapaPorId), validarCampos],
  etapaIdGet
);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR UN CLIENTE POR ID
router.put(
  "/:id",
  [
    check("id").custom(existeEtapaPorId),
    check("etapa_nombre", "La etapa_nombre es obligatoria").not().isEmpty(),
    check("descripcion", "La descripcion es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  etapaPut
);

// DEFINICIÓN DE RUTA PARA ELIMINAR UN CLIENTE POR ID
router.delete(
  "/:id",
  [check("id").custom(existeEtapaPorId), validarCampos],
  etapaDelete
);

// DEFINICIÓN DE RUTA PARA AGREGAR UN NUEVO CLIENTE
router.post(
  "/actividades",
  [
    check("id_etapa").custom(existeEtapaPorId),
    check("actividades").custom(existenActividadesPorId),
    validarCampos,
  ],
  etapaActividadesPost
);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
