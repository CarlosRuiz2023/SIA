// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const { vacacionesGet } = require('../../controllers/catalogos/vacaciones-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER LAS VACACIONES
router.get('/', vacacionesGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
