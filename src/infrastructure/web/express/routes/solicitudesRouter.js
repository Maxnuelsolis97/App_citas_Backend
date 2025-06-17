const express = require('express');
const router = express.Router();
const { 
  solicitarPostergacion, 
  gestionarSolicitud 
} = require('../controllers/solicitudesController');

const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);
router.post('/', solicitarPostergacion);
router.put('/:id', gestionarSolicitud);

module.exports = router;
