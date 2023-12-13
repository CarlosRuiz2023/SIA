const { Router } = require('express');

const { vacacionesGet } = require('../../controllers/catalogos/vacaciones-controller');

const router = Router();

router.get('/', vacacionesGet);

module.exports = router;