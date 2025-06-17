// src/infrastructure/web/express/controllers/usuariosController.js
const UsuarioService = require('../../../../core/services/UsuarioService');
const UsuarioMySQLRepository = require('../../../../infrastructure/database/mysql/UsuarioMySQLRepository');


// Dependencias
const usuarioRepository = new UsuarioMySQLRepository();
const usuarioService = new UsuarioService(usuarioRepository);

const crearUsuario = async (req, res) => {
  try {
    // El servicio maneja toda la lógica
    const usuarioRegistrado = await usuarioService.registrarUsuario(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: usuarioRegistrado.id,
        dni: usuarioRegistrado.dni,
        nombres: usuarioRegistrado.nombres,
        correo: usuarioRegistrado.correo,
        rol: usuarioRegistrado.rol
      }
    });

  } catch (error) {
    console.error('Error en crearUsuario:', error);
    
    // Manejo de errores específicos
    const statusCode = error.message.includes('ya existe') ? 409 : 400;
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack
      })
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
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message
      })
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

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId
};