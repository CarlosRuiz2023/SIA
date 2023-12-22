const { Router } = require('express');

const { bitacoraAccesoGet, bitacoraAccesosPost  } = require('../../controllers/catalogos/bitacoraAccesos-controller');

const router = Router();

router.post('/datos', bitacoraAccesoGet);
router.post('/', bitacoraAccesosPost);


module.exports = router;