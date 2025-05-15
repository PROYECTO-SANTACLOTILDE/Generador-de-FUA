import express from 'express';
const path = require('path');
import { getPatient } from './services/fhirService';

// Sequelize
import { sequelize } from './models/database';
import './models/User.js';
import './models/FUAFormat.js';
import './models/FUAPage.js';
import './models/FUASection.js';
import './models/FUAField.js';
import './models/FUAFieldColumn.js';
import './models/FUAFieldRow.js';
import './models/FUAFieldCell.js';

// Services
import './services/FUAFormatService';
import FUAFormatService from './services/FUAFormatService';
import UserService from './services/UserService';

const app = express();
const port = 3000;

// Testing database connection
// Consider to envelope m,ain in a async function
sequelize.authenticate()
.then((): void => {
  console.log('Connection has been established successfully.');

  // Syncronize models
  console.log('Syncronizing models ...');
  sequelize.sync({ force: true })
  .then( () : void => {
    console.log('Ended syncronizing models ...');
  } );
  

})
.catch((error: unknown): void => {
  if (error instanceof Error) {
    console.error('Unable to connect to the database:', error.message);
  } else {
    console.error('An unknown error occurred during connection.');
  }
});

// Save static files
app.use(express.static(path.resolve(__dirname, './public')));


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

// Serve index.html
app.get('/FUA', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/FUA_Modeled.html'));
});

//TESTING ENTITIES

//TESTING ENTITIES
app.post('/UserTest', async (req, res) => {
  try {
    const newUser = await UserService.createUserTest(
      {
        username: "admin",
        realPassword: "admin",
        secretQuestion: "question",
        secretAnswer: "answer",
      }
    );
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create User.' });
  }
});

// Create test FUA Format
app.post('/FUAFormatTest', async (req, res) => {
  try {
    const newFUAFormat = await FUAFormatService.createFUAFormat(
      {
        codeName: "test",
        version: "version",
        createdBy: 1
      }
    );
    res.status(201).json(newFUAFormat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create FUA Format', info: err });
  }
});
