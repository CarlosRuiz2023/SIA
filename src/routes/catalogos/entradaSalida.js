// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require("express");

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const {
  tipoHorarioGet,
} = require("../../controllers/catalogos/tipoHorario-controller");

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get("/", tipoHorarioGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
