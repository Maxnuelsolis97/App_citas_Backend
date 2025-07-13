const express = require('express');
const router = express.Router();
const {
  obtenerCitas,
  crearCita,
  cancelarCita,
  obtenerCitasDelUsuario,
  obtenerCitaProxima
} = require('../controllers/citasController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);
router.get('/', obtenerCitas);
router.post('/', crearCita);
router.put('/:id/cancelar', cancelarCita);
router.get('/mis-citas', obtenerCitasDelUsuario);
router.get('/proxima', obtenerCitaProxima);


module.exports = router;