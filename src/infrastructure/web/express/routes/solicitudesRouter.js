const express = require('express');
const router = express.Router();
const { 
  solicitarPostergacion, 
  gestionarSolicitud,
  listarSolicitudesPendientes,
  listarSolicitudesHistorial
} = require('../controllers/solicitudesController');

const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);
router.post('/', solicitarPostergacion);
router.put('/:id', gestionarSolicitud);
router.get('/pendientes', listarSolicitudesPendientes);
router.get('/historial', listarSolicitudesHistorial);


module.exports = router;
