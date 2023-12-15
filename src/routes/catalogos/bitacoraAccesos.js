const { Router } = require('express');

const { bitacoraAccesoGet  } = require('../../controllers/catalogos/bitacoraAccesos-controller');

const router = Router();

router.get('/', bitacoraAccesoGet);


module.exports = router;