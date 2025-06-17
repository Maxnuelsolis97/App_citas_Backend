const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../../../database/mysql/db');

const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const [users] = await connection.execute(
      'SELECT id, contraseña, rol FROM usuarios WHERE correo = ? LIMIT 1',
      [correo]
    );

    if (users.length === 0 || !(await bcrypt.compare(contraseña, users[0].contraseña))) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Mensaje genérico
    }

    const usuario = users[0];
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    res.json({ token, rol: usuario.rol, id: usuario.id });

  } catch (error) {
    console.error('Error en login:', process.env.NODE_ENV === 'development' ? error : 'Detalle oculto');
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };