// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const { modulosGet, subModulosGet, modulosSubModulosGet } = require('../../controllers/catalogos/modulos-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS MÓDULOS
router.get('/', modulosGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS SUBMÓDULOS
router.get('/subModulos/', subModulosGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS MÓDULOS CON SUS SUBMÓDULOS
router.get('/modulosSubModulos/', modulosSubModulosGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
