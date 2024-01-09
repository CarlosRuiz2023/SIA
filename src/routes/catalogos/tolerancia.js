// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const { toleranciaGet } = require('../../controllers/catalogos/tolerancia-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS TOLERANCIAS
router.get('/', toleranciaGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
