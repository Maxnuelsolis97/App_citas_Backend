// src/core/services/CitaService.js

const Cita = require('../domain/Cita');
const connection = require('../../infrastructure/database/mysql/db');

class CitaService {
  constructor(citaRepository) {
    this.citaRepository = citaRepository;
  }

  async obtenerCitas() {
    const citas = await this.citaRepository.obtenerTodas();
    return citas.map(cita => new Cita(cita));
  }

  async crearCita(datos, usuarioId) {
    const { especialidad, fecha, hora } = datos;

    if (!especialidad || !fecha || !hora) {
      throw new Error('Especialidad, fecha y hora son obligatorios');
    }

    // Verificar si la especialidad existe y está activa
    const [rows] = await connection.execute(
      'SELECT id FROM especialidades WHERE id = ? AND activa = 1 LIMIT 1',
      [especialidad]
    );

    if (rows.length === 0) {
      throw new Error(`La especialidad con ID ${especialidad} no está registrada o no está activa`);
    }

    const especialidadId = rows[0].id;

    // Crear nueva cita
    const cita = new Cita({
      usuarioId,
      especialidadId,
      fecha,
      hora,
      estado: 'pendiente'
    });

    return await this.citaRepository.guardar(cita);
  }

  async cancelarCita(id) {
    if (!id) throw new Error('El ID de cita es obligatorio');

    const citaExistente = await this.citaRepository.buscarPorId(id);
    if (!citaExistente) throw new Error('Cita no encontrada');

    const cita = new Cita(citaExistente);
    if (!cita.puedeSerCancelada()) {
      throw new Error('La cita no puede cancelarse en su estado actual');
    }

    return await this.citaRepository.actualizar(cita.id, {
      estado: 'cancelada',
      actualizadoEn: new Date()
    });
  }

  async solicitarPostergacion(id, motivo) {
    const citaExistente = await this.citaRepository.buscarPorId(id);
    if (!citaExistente) throw new Error('Cita no encontrada');

    const cita = new Cita(citaExistente);
    cita.solicitarPostergacion(motivo);

    return await this.citaRepository.actualizar(cita.id, {
      estado: cita.estado,
      motivoPostergacion: cita.motivoPostergacion,
      actualizadoEn: cita.actualizadoEn
    });
  }
}

module.exports = CitaService;
