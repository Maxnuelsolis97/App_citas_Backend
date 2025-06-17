// src/core/ports/UsuarioRepository.js
class UsuarioRepository {
  async guardar(usuario) {
    throw new Error('Método no implementado');
  }
  
  async buscarPorId(id) {
    throw new Error('Método no implementado');
  }
  
  async buscarPorCorreo(correo) {
    throw new Error('Método no implementado');
  }

  async existeUsuarioPorDniOCorreo(dni, correo) {
    throw new Error('Método no implementado');
  }

  async obtenerTodos() {
    throw new Error('Método no implementado');
  }

  async actualizar(usuario) {
    throw new Error('Método no implementado');
  }

  async eliminar(id) {
    throw new Error('Método no implementado');
  }
}

module.exports = UsuarioRepository;