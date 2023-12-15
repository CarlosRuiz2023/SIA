const { Router } = require('express');

const { rolesGet, rolesTodosGet, rolesPermisosPut } = require('../../controllers/catalogos/roles-controller');

const router = Router();

router.get('/rolPermiso/', rolesGet);

router.get('/', rolesTodosGet);

router.put('/', rolesPermisosPut);

module.exports = router;