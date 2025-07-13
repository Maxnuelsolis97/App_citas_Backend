const connection = require('../../../database/mysql/db');

const obtenerEspecialidades = async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM especialidades');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).json({ error: 'Error al obtener las especialidades' });
  }
};

module.exports = { obtenerEspecialidades };
