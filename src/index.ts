import express from 'express';
import { getPatient } from './services/fhirService';

const app = express();
const port = 3000;

// Ruta para la raíz
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
