const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');

//Routes
const usuariosRouter = require(path.join(__dirname, 'src/infrastructure/web/express/routes/usuariosRouter'));
const citasRouter = require(path.join(__dirname, 'src/infrastructure/web/express/routes/citasRouter'));
const authRouter = require(path.join(__dirname, 'src/infrastructure/web/express/routes/authRouter'));
const solicitudesRouter = require(path.join(__dirname, 'src/infrastructure/web/express/routes/solicitudesRouter'));
const especialidadesRouter = require(path.join(__dirname, 'src/infrastructure/web/express/routes/especialidadesRouter'));


const app = express();

app.use(express.json());
app.use(cors());
app.use('/usuarios', usuariosRouter);
app.use('/citas', citasRouter);
app.use('/auth', authRouter);
app.use('/solicitudes-postergacion', solicitudesRouter);
app.use('/especialidades', especialidadesRouter);

app.get('/', (req, res) => {
  res.send('¡Servidor corriendo correctamente! 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

