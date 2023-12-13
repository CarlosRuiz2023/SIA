const { Router } = require('express');

const { toleranciaGet } = require('../../controllers/catalogos/tolerancia-controller')

const router = Router();

router.get('/', toleranciaGet);

module.exports = router;