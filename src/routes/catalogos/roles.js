const { Router } = require('express');

const { rolesGet, rolesTodosGet } = require('../../controllers/catalogos/roles-controller');

const router = Router();

router.get('/rolPermiso/', rolesGet);

router.get('/', rolesTodosGet)

module.exports = router;