const express = require('express');
const router = express.Router();

const { login, getUsuarioActual, register } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', register); // <--- ESTA ES LA NUEVA RUTA
router.get('/user', authMiddleware, getUsuarioActual);

module.exports = router;
