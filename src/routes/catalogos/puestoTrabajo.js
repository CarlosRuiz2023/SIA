// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DEL CONTROLADOR NECESARIO
const { puestoTrabajoGet } = require('../../controllers/catalogos/puestoTrabajo-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PUESTOS DE TRABAJO
router.get('/', puestoTrabajoGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
