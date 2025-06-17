// src/infrastructure/web/express/routes/usuariosRouter.js

const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, obtenerUsuarioPorId } = require('../controllers/usuariosController');
const verifyToken = require('../middlewares/verifyToken');

// Rutas públicas (no requieren token)
router.post('/', crearUsuario);

// Rutas protegidas
router.get('/', verifyToken, obtenerUsuarios);
router.get('/:id', verifyToken, obtenerUsuarioPorId);

module.exports = router;
