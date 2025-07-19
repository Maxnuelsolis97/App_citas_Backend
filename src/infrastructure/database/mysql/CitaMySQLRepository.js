// src/infrastructure/database/mysql/CitaMySQLRepository.js

const CitaRepository = require('../../../core/ports/CitaRepository');
const connection = require('./db');

class CitaMySQLRepository extends CitaRepository {
  async guardar(cita) {
    // Validación mínima
    if (!cita.usuarioId || !cita.especialidadId || !cita.fecha || !cita.hora) {
      throw new Error('usuarioId, especialidadId, fecha y hora son obligatorios');
    }

    const [result] = await connection.execute(
      `INSERT INTO citas 
       (usuario_id, especialidad_id, fecha, hora, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        cita.usuarioId,
        cita.especialidadId,
        cita.fecha,
        cita.hora,
        cita.estado || 'pendiente'
      ]
    );

    return {
      id: result.insertId,
      usuarioId: cita.usuarioId,
      especialidadId: cita.especialidadId,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado || 'pendiente'
    };
  }

  async buscarPorId(id) {
    const [rows] = await connection.execute(
      'SELECT * FROM citas WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async actualizar(id, campos) {
    const keys = Object.keys(campos);
    const values = Object.values(campos);

    if (keys.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    const sets = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE citas SET ${sets} WHERE id = ?`;

    await connection.execute(sql, [...values, id]);

    return { id, ...campos };
  }

  async obtenerTodas() {
    const [rows] = await connection.execute('SELECT * FROM citas');
    return rows;
  }
}

module.exports = CitaMySQLRepository;
