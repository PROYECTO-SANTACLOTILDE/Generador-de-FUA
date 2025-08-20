// Import Libraries
require('dotenv').config();
import express from 'express';
const path = require('path');
var wkhtmltopdf = require('wkhtmltopdf');



// Sequelize and models
import { sequelize } from './modelsSequelize/database';

// Services
import { getPatient } from './services/fhirService';

// Import Routes
import globalRouter from './routes/indexRoutes';
import { createDemoFormat } from './utils/utils';

// Parameters and other options
const app = express();
const port = process.env.PORT || 3000;

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
  console.error('Unable to connect to the database: ');
  console.error(error);
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
  res.sendFile(path.resolve(__dirname, './public/FUA_Previsualization.html'));
});


//TESTING ENTITIES
app.get('/demo', async (req, res) => {
  try {
    const demoAnswer = await createDemoFormat();
    res.status(200).send(demoAnswer);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create demo. ', 
      message: (err as (Error)).message,
      details: (err as any).details ?? null,
    });
  }
});


//TESTING WKHTML
app.get('/demopdf', async (req, res) => {
  try {
    const demoAnswer = await createDemoFormat();
    // Set headers before piping
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline; filename="demo.pdf"');
    const pdfTest = wkhtmltopdf(demoAnswer, {
      disableSmartShrinking: true,
      /* pageWidth:  "210mm",
      pageHeight: "306mm", */
      pageSize: "A4",
      marginTop: "0mm",
      marginRight: "0mm",
      marginBottom: "0mm",
      marginLeft: "0mm",
      javascriptDelay: 3000

    }).pipe(res);
    //res.status(200).send(demoAnswer);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create demo. ', 
      message: (err as (Error)).message,
      details: (err as any).details ?? null,
    });
  }
});

