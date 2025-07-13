const CitaRepository = require('../../../core/ports/CitaRepository');
const connection = require('./db');

class CitaMySQLRepository extends CitaRepository {
  async guardar(cita) {
    const [result] = await connection.execute(
      `INSERT INTO citas 
       (usuario_id, especialidad_id, fecha, hora, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [cita.usuarioId, cita.especialidadId, cita.fecha, cita.hora, cita.estado || 'pendiente']
    );
    return { id: result.insertId, ...cita };
  }

  async buscarPorId(id) {
    const [rows] = await connection.execute(
      'SELECT * FROM citas WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  async obtenerTodas() {
    const [rows] = await connection.execute(
      'SELECT * FROM citas'
    );
    return rows;
  }

  async actualizar(id, cambios) {
    const campos = [];
    const valores = [];
    
    Object.keys(cambios).forEach(key => {
      campos.push(`${key} = ?`);
      valores.push(cambios[key]);
    });

    valores.push(id);

    const [result] = await connection.execute(
      `UPDATE citas SET ${campos.join(', ')} WHERE id = ?`,
      valores
    );

    return result.affectedRows > 0;
  }

  async cancelar(id) {
    return this.actualizar(id, { 
      estado: 'cancelada',
      actualizadoEn: new Date()
    });
  }

  async solicitudesPostergacion() {
    const [rows] = await connection.execute(
      `SELECT * FROM citas WHERE estado = 'en_revision'`
    );
    return rows;
  }
}

module.exports = CitaMySQLRepository;