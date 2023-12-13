const { Router } = require('express');

const { puestoTrabajoGet } = require('../../controllers/catalogos/puestoTrabajo-controller');

const router = Router();

router.get('/', puestoTrabajoGet);

module.exports = router;