// src/infrastructure/web/express/routes/citasRouter.js

const express = require('express');
const router = express.Router();
const {
  obtenerCitas,
  crearCita,
  cancelarCita
} = require('../controllers/citasController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);

// GET /citas - Obtener todas las citas
router.get('/', obtenerCitas);

// POST /citas - Crear nueva cita
router.post('/', crearCita);

// PUT /citas/:id/cancelar - Cancelar cita específica (mejor práctica REST)
router.put('/:id/cancelar', cancelarCita);

module.exports = router;