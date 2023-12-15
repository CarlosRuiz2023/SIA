const { Router } = require('express');

const { modulosGet, subModulosGet , modulosSubModulosGet} = require('../../controllers/catalogos/modulos-controller');

const router = Router();

router.get('/', modulosGet);

router.get('/subModulos/', subModulosGet);

router.get('/modulosSubModulos/', modulosSubModulosGet);


module.exports = router;