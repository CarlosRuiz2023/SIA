// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  entradaSalidaGet,
  reporteEntradasSalidasPost,
} = require("../../controllers/catalogos/entradaSalida-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get("/", entradaSalidaGet);

// DEFINICIÓN DE RUTA PARA OBTENER DATOS DE LA BITÁCORA DE ACCESO
router.post("/datos", reporteEntradasSalidasPost);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
