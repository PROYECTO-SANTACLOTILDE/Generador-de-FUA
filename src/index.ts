// Import Libraries
require('dotenv').config();
import express from 'express';
const path = require('path');

import puppeteer, { Browser } from "puppeteer";


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

//TESTING Puppeteer

let browserPromise: Promise<Browser> | null = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true, // pas "new"
      args: ["--no-sandbox", "--font-render-hinting=none"],
    });
  }
  return browserPromise;
}

app.get('/demopdf', async (req, res) => {
  let demoAnswer = '';
  try {
    demoAnswer = await createDemoFormat();
   
    //res.status(200).send(demoAnswer);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create demo. ', 
      message: (err as (Error)).message,
      details: (err as any).details ?? null,
    });
  }
  try {

    const browser = await getBrowser();
    const page = await browser.newPage();

    // 1) Mode impression
    await page.emulateMediaType("print");

    // 2) Charger le HTML (équiv. à wkhtmltopdf qui lit une string)
    //    Si ton HTML référence des CSS/images relatives, passe un baseURL (file://… ou http://…)
    await page.setContent(demoAnswer, {
      waitUntil: "networkidle0",
    });

    // 4) Deux façons de fixer la taille 210×306 mm :
    //    A) (recommandée) Laisser le CSS décider: ajouter dans ton CSS:
    //       @page { size: 210mm 306mm; margin: 0; }
    //       .fua-container { width:210mm; height:306mm; }
    //       et utiliser preferCSSPageSize: true
    const useCssPageSize = false;

    const pdfBuffer = await page.pdf(
      useCssPageSize
        ? {
            printBackground: true,
            preferCSSPageSize: true,           // <-- respecte @page { size: ... }
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
            pageRanges: "1-",
            scale: 1,
          }
        : {
            printBackground: true,
            preferCSSPageSize: false,
            width: "210mm",                    // <-- taille forcée côté Puppeteer
            height: "306mm",
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
            pageRanges: "1-",
            displayHeaderFooter: false,
            scale: 1,
          }
    );

    await page.close();

    // 5) Réponse HTTP (équivalent à ton pipe wkhtmltopdf)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", 'inline; filename="demo.pdf"');
    res.status(200).end(pdfBuffer);

  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create demo.",
      message: err?.message,
      details: err?.stack ?? null,
    });
  }
});

