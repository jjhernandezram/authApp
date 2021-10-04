const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Puerto de la aplicación
const port = process.env.PORT || 3000;

// Creando la aplicación express
const app = express();

// - Conexión a la base de datos
dbConnection();

// Middlewares
// - Cors
app.use(cors());

// - Lectura y parseo del body
app.use(express.json());

// - Creación de la carpeta publica
app.use(express.static('public'));

// - Configuración de rutas
app.use('/api/auth', require('./routes/auth'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
