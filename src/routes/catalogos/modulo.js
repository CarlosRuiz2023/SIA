const { Router } = require('express');

const { modulosGet, subModulosGet } = require('../../controllers/catalogos/modulos-controller');

const router = Router();

router.get('/', modulosGet);

router.get('/subModulos/', subModulosGet);

module.exports = router;