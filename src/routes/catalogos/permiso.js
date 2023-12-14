const { Router } = require('express');

const { permisosGet } = require('../../controllers/catalogos/permiso-controller');

const router = Router();

router.get('/', permisosGet)

module.exports = router;