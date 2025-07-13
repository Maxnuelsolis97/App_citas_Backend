const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } = require('../controllers/usuariosController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', crearUsuario);
router.get('/', verifyToken, obtenerUsuarios);
router.get('/:id', verifyToken, obtenerUsuarioPorId);
router.put('/:id', verifyToken, actualizarUsuario);
router.delete('/:id', verifyToken, eliminarUsuario);

module.exports = router;