const UsuarioRepository = require('../../../core/ports/UsuarioRepository');
const connection = require('./db');

class UsuarioMySQLRepository extends UsuarioRepository {
  async guardar(usuario) {
    await usuario.hashearContrasena();
    const [result] = await connection.execute(
      `INSERT INTO usuarios 
       (dni, nombres, apellidos, correo, celular, contrasena, rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [usuario.dni, usuario.nombres, usuario.apellidos, 
       usuario.correo, usuario.celular, usuario.contrasena, usuario.rol]
    );
    usuario.id = result.insertId;
    return usuario;
  }

  async buscarPorId(id) {
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  async buscarPorCorreo(correo) {
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );
    return rows[0] || null;
  }

  async existeUsuarioPorDniOCorreo(dni, correo) {
    const [rows] = await connection.execute(
      'SELECT id FROM usuarios WHERE dni = ? OR correo = ? LIMIT 1',
      [dni, correo]
    );
    return rows.length > 0;
  }

  async obtenerTodos() {
    const [rows] = await connection.execute('SELECT id, dni, nombres, apellidos, correo, celular, rol FROM usuarios');
    return rows;
  }

  async actualizar(usuario) {
    const [result] = await connection.execute(
      `UPDATE usuarios SET
       nombres = ?, apellidos = ?, celular = ?
       WHERE id = ?`,
      [usuario.nombres, usuario.apellidos, usuario.celular, usuario.id]
    );
    return result.affectedRows > 0;
  }

  async eliminar(id) {
    const [result] = await connection.execute(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async eliminarCitasPorUsuario(usuarioId) {
  const [result] = await connection.execute(
    'DELETE FROM citas WHERE usuario_id = ?',
    [usuarioId]
  );
  return result.affectedRows > 0;
}

}

module.exports = UsuarioMySQLRepository;