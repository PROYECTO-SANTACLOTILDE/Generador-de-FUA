// Import Libraries
import express, { Request, Response} from 'express';
const path = require('path');



// Sequelize and models
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
import FUAPageService from './services/FUAPageService';
import { getPatient } from './services/fhirService';

// Parameters
const app = express();
const port = 3000;

// Testing database connection
// Consider to envelope main in a async function
sequelize.authenticate()
.then((): void => {
  console.log('Connection has been established successfully.\n');

  // Syncronize models
  console.log('Syncronizing models ...');
  sequelize.sync({ force: true })
  //sequelize.sync()
  .then( () : void => {
    console.log('Ended syncronizing models ...\n');
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
app.use(express.json());


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


// Create FUA Format
app.post('/FUAFormat', async (req: Request, res: Response) => {
  const payload = req.body;
  
  try {    
    const newFUAFormat = await FUAFormatService.createFUAFormat( payload );
    res.status(201).json(newFUAFormat);
  } catch (err: unknown) {
    res.status(500).json( JSON.parse(JSON.stringify({ 
      error: 'Failed to create FUA Format.', 
      detail: (err as (Error)).message,
    })) );
  }
});


// List FUA Formats
app.get('/FUAFormat', async (req, res) => {
  try {
    let listFUAFormats = await FUAFormatService.listAllFUAFormats();
    res.status(201).json(listFUAFormats);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ 
      error: 'Failed to list FUA Formats',
      info: (err as Error).message 
    });
  }
});

// create FUA Page
app.post('/FUAPage', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newFUAPage = await FUAPageService.createFUAPage( data );
    res.status(201).json(newFUAPage);
  } catch (err: unknown) {
    console.error("ERROR: ", err);
    res.status(500).json({
      error: 'Failed to create FUA Format', 
      info: (err as Error).message 
    });
  }
});
