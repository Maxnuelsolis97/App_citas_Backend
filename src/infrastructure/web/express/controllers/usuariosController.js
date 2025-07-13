const UsuarioService = require('../../../../core/services/UsuarioService');
const UsuarioMySQLRepository = require('../../../../infrastructure/database/mysql/UsuarioMySQLRepository');

const usuarioRepository = new UsuarioMySQLRepository();
const usuarioService = new UsuarioService(usuarioRepository);

const crearUsuario = async (req, res) => {
  try {
    // Extraemos todos los campos necesarios
    const { dni, nombres, apellidos, correo, celular, contraseña } = req.body;

    // Validación completa
    if (!dni) throw new Error('DNI es requerido');
    if (!nombres) throw new Error('Nombres son requeridos');
    if (!apellidos) throw new Error('Apellidos son requeridos');
    if (!correo) throw new Error('Correo es requerido');
    if (!celular) throw new Error('Celular es requerido');
    if (!contraseña) throw new Error('Contraseña es requerida');

    const usuario = {
      dni,
      nombres,
      apellidos,
      correo,
      celular,
      contraseña,
      rol: "paciente" // Rol por defecto
    };

    const usuarioRegistrado = await usuarioService.registrarUsuario(usuario);
    
    res.status(201).json({
      success: true,
      data: {
        dni: usuarioRegistrado.dni,
        nombres: usuarioRegistrado.nombres,
        correo: usuarioRegistrado.correo
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios();
    
    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios.map(u => ({
        id: u.id,
        dni: u.dni,
        nombres: u.nombres,
        apellidos: u.apellidos,
        correo: u.correo,
        rol: u.rol
      }))
    });

  } catch (error) {
    console.error('Error en obtenerUsuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message,
      stack: error.stack
});
  }
};
//Método para obtener un usuario específico
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: usuario.id,
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        celular: usuario.celular,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en obtenerUsuarioPorId:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
    });
  }
};
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: usuarioActualizado
    });

  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario',
      ...(process.env.NODE_ENV === 'development'
        ? { details: error.message }
        : {})
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await usuarioService.eliminarUsuario(req.params.id);

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error('Error en eliminarUsuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      ...(process.env.NODE_ENV === 'development'
        ? { details: error.message }
        : {})
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
}