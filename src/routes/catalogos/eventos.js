// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");
const {
  eventosGet,
} = require("../../controllers/catalogos/eventos-controller");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get("/", eventosGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
