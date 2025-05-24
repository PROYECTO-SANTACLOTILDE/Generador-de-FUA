// Import Libraries
import express from 'express';
const path = require('path');

// Sequelize and models
import { sequelize } from './models/database';

// Services
import { getPatient } from './services/fhirService';

// Import Routes
import globalRouter from './routes/indexRoutes';

// Parameters and other options
const app = express();
const port = 3000;

// Testing database connection
// Consider to envelope main in a async function
console.log(`\nTesting connection with database ...\n`);
sequelize.authenticate()
.then((): void => {
  console.log(`\nConnection has been established with database successfully.\n`);  
  // Syncronize models
  console.log('\n Syncronizing models ... \n');
  //sequelize.sync({ force: true })
  sequelize.sync({ alter: true })
  .then( () : void => {
    console.log('\nEnded syncronizing models ...\n');
  } );
  

})
.catch((error: unknown): void => {
  if (error instanceof Error) {
    console.error('Unable to connect to the database:', error.message);
  } else {
    console.error('An unknown error occurred during connection.');
  }
});

// Importing utilities for Express
app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.json());

// Importing Routes
app.use('/ws', globalRouter);


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
  console.log(`\nServidor corriendo en http://localhost:${port} \n`);
});

// Serve index.html
app.get('/FUA', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/FUA_Modeled.html'));
});

//TESTING ENTITIES

//TESTING ENTITIES
/* app.post('/UserTest', async (req, res) => {
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
}); */



