const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { obtenerEspecialidades } = require('../controllers/especialidadesController');

router.use(verifyToken);
router.get('/', obtenerEspecialidades);

module.exports = router;