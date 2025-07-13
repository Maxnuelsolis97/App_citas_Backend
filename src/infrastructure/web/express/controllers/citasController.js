const connection = require('../../../database/mysql/db');
const CitaService = require('../../../../core/services/CitaService');
const CitaMySQLRepository = require('../../../database/mysql/CitaMySQLRepository');

const citaRepository = new CitaMySQLRepository();
const citaService = new CitaService(citaRepository);

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

const obtenerCitasDelUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [result] = await connection.execute(
      'SELECT * FROM citas WHERE usuario_id = ? ORDER BY fecha DESC',
      [usuarioId]
    );

    return res.status(200).json({
      success: true,
      total: result.length,
      citas: result
    });

  } catch (error) {
    console.error('Error al obtener citas del usuario:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener las citas del usuario'
    });
  }
};

const obtenerCitaProxima = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const [result] = await connection.execute(
      'SELECT * FROM citas WHERE usuario_id = ? AND estado = "pendiente" ORDER BY fecha ASC, hora ASC LIMIT 1',
      [usuarioId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'No tienes una cita activa' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la próxima cita' });
  }
};

module.exports = {
  obtenerCitas,
  crearCita,
  cancelarCita,
  obtenerCitasDelUsuario,
  obtenerCitaProxima
};
