import express from 'express';
import { getPatient } from './services/fhirService';

import { sequelize } from './models/database';
import './models/User.js';
import './models/FUAFormat.js';


const app = express();
const port = 3000;

// Testing database connection
sequelize.authenticate()
.then((): void => {
  console.log('Connection has been established successfully.');

  // Syncronize models
  console.log('Syncronizing models ...');
  sequelize.sync();
  console.log('Ended syncronizing models ...');

})
.catch((error: unknown): void => {
  if (error instanceof Error) {
    console.error('Unable to connect to the database:', error.message);
  } else {
    console.error('An unknown error occurred during connection.');
  }
});


// Comentario para marcelo: Ya funciona el getter del patients a través de la API de OpenMRS, faltarian ajustar algunas cosas como el cors y la seguridad, revisar servicios de getPatient.
app.get('/', (req, res) => {
  res.send('¡Servidor Express en funcionamiento!');
});

// Ruta para obtener un paciente por ID
app.get('/patient/:id', async (req, res) => {
  const { id } = req.params;
  const patient = await getPatient(id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: 'Paciente no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
