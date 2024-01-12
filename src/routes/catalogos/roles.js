// IMPORTACIÓN DEL OBJETO 'ROUTER' DE LA BIBLIOTECA 'EXPRESS'
const { Router } = require('express');

// IMPORTACIÓN DE LOS CONTROLADORES NECESARIOS
const { rolesGet, rolesTodosGet, rolesPermisosPut } = require('../../controllers/catalogos/roles-controller');

// CREACIÓN DEL ENRUTADOR
const router = Router();

// DEFINICIÓN DE RUTA PARA OBTENER ROLES CON PERMISOS
router.get('/rolPermiso/', rolesGet);

// DEFINICIÓN DE RUTA PARA OBTENER TODOS LOS ROLES
router.get('/', rolesTodosGet);

// DEFINICIÓN DE RUTA PARA ACTUALIZAR PERMISOS DE ROLES
router.put('/', rolesPermisosPut);

// EXPORTACIÓN DEL ENRUTADOR
module.exports = router;
