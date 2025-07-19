const jwt = require('jsonwebtoken');
const connection = require('../../../database/mysql/db');

// LOGIN
const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  console.log('Datos recibidos en login:', correo, contrasena);

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contrasena son requeridos' });
  }

  try {
    const [users] = await connection.execute(
      'SELECT id, nombres, apellidos, correo, contrasena, rol FROM usuarios WHERE correo = ? LIMIT 1',
      [correo.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = users[0];
    console.log('Contraseña recibida:', contrasena);
    console.log('Contraseña en BD:', usuario.contrasena);

    if (usuario.contrasena.trim() !== contrasena.trim()) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// OBTENER USUARIO ACTUAL
const getUsuarioActual = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await connection.execute(
      'SELECT id, nombres, apellidos, correo, rol FROM usuarios WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// REGISTRO
const register = async (req, res) => {
  const { dni, nombres, apellidos, celular, correo, contrasena } = req.body;

  if (!dni || !nombres || !apellidos || !celular || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const [existing] = await connection.execute(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    await connection.execute(
      `INSERT INTO usuarios (dni, nombres, apellidos, celular, correo, contrasena, rol)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dni, nombres, apellidos, celular, correo.trim(), contrasena.trim(), 'paciente']
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  getUsuarioActual,
  register
};
