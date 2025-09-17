const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Middleware para validar JWT
function validarJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  // Solo decodifica, no verifica firma (para Google JWT)
  try {
    const decoded = jwt.decode(token);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

app.get('/', (req, res) => {
  res.send('API de Gestión de Gastos');
});

// Ruta protegida para crear un gasto
app.post('/gasto', validarJWT, async (req, res) => {
  const { userId, gasto, montoAnterior } = req.body;
  try {
    const nuevoGasto = await prisma.gasto.create({
      data: {
        usuarioId: userId,
        gasto,
        montoAnterior,
        fecha: new Date()
      }
    });
    res.status(201).json(nuevoGasto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener todos los gastos
app.get('/gastos', async (req, res) => {
  const gastos = await prisma.gasto.findMany();
  res.json(gastos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
