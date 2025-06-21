// src/core/services/UsuarioService.js
const Usuario = require('../domain/Usuario');

class UsuarioService {
  constructor(usuarioRepository) {
    this.repository = usuarioRepository;
  }

  async registrarUsuario(datosUsuario) {
    const usuario = new Usuario(datosUsuario);
    
    // Verificar unicidad antes de guardar
    if (await this.repository.existeUsuarioPorDniOCorreo(usuario.dni, usuario.correo)) {
      throw new Error('El usuario ya existe (DNI o correo duplicado)');
    }

    return await this.repository.guardar(usuario);
  }

  async autenticar(correo, contraseñaPlana) {
    const usuario = await this.repository.buscarPorCorreo(correo);
    if (!usuario) return null;
    
    const usuarioEntidad = new Usuario(usuario);
    const coincide = await usuarioEntidad.compararContraseña(contraseñaPlana);
    
    return coincide ? usuarioEntidad : null;
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await this.repository.buscarPorId(id);
    return usuario ? new Usuario(usuario) : null;
  }

  async obtenerTodosLosUsuarios() {
    const usuarios = await this.repository.obtenerTodos();
    return usuarios;
  }

  async actualizarUsuario(id, datosActualizacion) {
    const usuarioExistente = await this.obtenerUsuarioPorId(id);
    if (!usuarioExistente) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar solo campos permitidos
    const camposPermitidos = ['nombres', 'apellidos', 'celular'];
    Object.keys(datosActualizacion).forEach(key => {
      if (camposPermitidos.includes(key)) {
        usuarioExistente[key] = datosActualizacion[key];
      }
    });

    return await this.repository.actualizar(usuarioExistente);
  }

  async eliminarUsuario(id) {
  const usuario = await this.repository.buscarPorId(id);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  await this.repository.eliminarCitasPorUsuario(id);

  const eliminado = await this.repository.eliminar(id);
  if (!eliminado) {
    throw new Error('No se pudo eliminar el usuario');
  }

  return true;
}

}

module.exports = UsuarioService;