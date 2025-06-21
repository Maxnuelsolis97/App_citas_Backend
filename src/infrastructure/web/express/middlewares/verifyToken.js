const jwt = require('jsonwebtoken');

console.log('CLAVE JWT:', process.env.JWT_SECRET);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Validar que se haya enviado el token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos los datos del usuario (id, rol) en el request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
