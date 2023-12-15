const { Router } = require('express');

const { permisosGet, permisoSubModuloGet } = require('../../controllers/catalogos/permiso-controller');

const router = Router();

router.get('/', permisosGet);

router.get('/permisoSubModulo/', permisoSubModuloGet);

module.exports = router;