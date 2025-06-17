// src/infrastructure/web/express/controllers/citasController.js
const CitaService = require('../../../../core/services/CitaService');
const CitaMySQLRepository = require('../../../database/mysql/CitaMySQLRepository');

// Inicialización de dependencias
const citaRepository = new CitaMySQLRepository();
const citaService = new CitaService(citaRepository);

// Obtener todas las citas 
const obtenerCitas = async (req, res) => {
  try {
    const citas = await citaService.obtenerCitas();
    res.json({
      success: true,
      count: citas.length,
      data: citas
    });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener citas',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

// Crear nueva cita
const crearCita = async (req, res) => {
  try {
    const nuevaCita = await citaService.crearCita(req.body);
    res.status(201).json({
      success: true,
      message: 'Cita creada correctamente',
      data: {
        id: nuevaCita.id,
        estado: nuevaCita.estado
      }
    });
  } catch (error) {
    const status = error.message.includes('obligatorio') ? 400 : 500;
    res.status(status).json({
      success: false,
      error: error.message
    });
  }
};

// Cancelar cita
const cancelarCita = async (req, res) => {
  try {
    await citaService.cancelarCita(req.params.id);
    res.json({ 
      success: true,
      message: 'Cita cancelada correctamente' 
    });
  } catch (error) {
    const status = error.message.includes('no encontrada') ? 404 : 
                  error.message.includes('puede cancelarse') ? 400 : 500;
    res.status(status).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  obtenerCitas,
  crearCita,
  cancelarCita
};