// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const { permisosGet, permisoSubModuloGet } = require('../../controllers/catalogos/permiso-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS
router.get('/', permisosGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS PERMISOS CON SUS SUBMÓDULOS
router.get('/permisoSubModulo/', permisoSubModuloGet);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
