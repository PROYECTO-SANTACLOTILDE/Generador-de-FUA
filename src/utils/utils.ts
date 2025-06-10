import { FUAField, FUASection } from "../models";
import FUAFieldService from "../services/FUAFieldService";
import FUAFormatService from "../services/FUAFormatService";
import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";

const crypto = require('crypto');

/**
 * Validates whether a given string is a valid UUID v4.
 * 
 * UUID v4 format: xxxxxxxx-xxxx-4xxx-[89ab]xxx-xxxxxxxxxxxx
 */
export function isValidUUIDv4(uuid: string): boolean {
  const uuidV4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidV4Regex.test(uuid);
}




export async function fillSection2(auxUser: string, auxVersion: string, sectionUUID: string){
  // Fecha de atencion table
  const table1 = await FUAFieldService.create({
    label: 'FECHA DE ATENCION',
    showLabel: true,
    labelOrientation: 'xd',
    labelPosition: 'xd',
    valueType: 'xd',
    orientation: 'xd',
    codeName: 'date',
    version: '0.1',
    bodyHeight: 9.9,
    bodyWidth: 49.8,
    top: 2.7,
    left: 0.0,
    labelSize: 3.0,
    FUASectionId: sectionUUID,
    createdBy: auxUser
  });  

  // Fecha de atencion table
  const table2 = await FUAFieldService.create({
    label: 'FECHA DE ATENCION',
    showLabel: true,
    labelOrientation: 'xd',
    labelPosition: 'xd',
    valueType: 'xd',
    orientation: 'xd',
    codeName: 'date',
    version: '0.1',
    bodyHeight: 9.9,
    bodyWidth: 49.8,
    top: 2.7,
    left: 0.0,
    FUASectionId: sectionUUID,
    labelSize: 3.0,
    createdBy: auxUser
  });  

};

export async function createDemoFormat(){
  // Some variables
  const auxUser = "demoUser";
  
  // Create demo format
  const auxFormat: any = await FUAFormatService.create( {
    codeName: "demoFormat",
    version: "0.1",
    createdBy: auxUser
  } );

  // Create 2 Pages
  let auxPages = [];
  for (let i = 0; i < 2; i++) {
    const auxPageUUID = await FUAPageService.create({
      title: '',
      codeName: '',
      version: '',
      pageNumber: i+1,
      FUAFormatId: auxFormat.uuid,
      createdBy: auxUser
    });
    auxPages.push(auxPageUUID.uuid);
  };

  // Section 1 : MINSA Symbols
  let section1 = await FUASectionService.create({
    title: '',
    showTitle: false,
    codeName: 'MINSA Symbols',
    version: '0.1',
    titleHeight: 1.0,
    bodyHeight: 7.6,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 2 : Formato unico de atencion
  let section2 = await FUASectionService.create({
    title: 'FORMATO UNICO DE ATENCIÓN',
    showTitle: true,
    codeName: 'fua',
    version: '0.1',
    titleHeight: 3.4,
    bodyHeight: 48,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 3 : Del asegurado usuario
  let section3 = await FUASectionService.create({
    title: 'DEL ASEGURADO USUARIO',
    showTitle: true,
    codeName: 'person',
    version: '0.1',
    titleHeight: 2.2,
    bodyHeight: 33.6,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 4 : De la atencion
  let section4 = await FUASectionService.create({
    title: 'DE LA ATENCIÓN',
    showTitle: true,
    codeName: 'visit',
    version: '0.1',
    titleHeight: 2.4,
    bodyHeight: 47.7,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 5 : Destino asegurado
  let section5 = await FUASectionService.create({
    title: 'DEL DESTINO DEL ASEGURADO/USUARIO',
    showTitle: true,
    codeName: 'visit',
    version: '0.1',
    titleHeight: 2.3,
    bodyHeight: 16,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 6 : Actividades y vacunas
  let section6 = await FUASectionService.create({
    title: 'ACTIVIDADES Y VACUNAS',
    showTitle: true,
    codeName: 'other activities',
    version: '0.1',
    titleHeight: 2.5,
    bodyHeight: 37.8,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 7 : Diagnosticos
  let section7 = await FUASectionService.create({
    title: 'DIAGNÒSTICOS',
    showTitle: true,
    codeName: 'diags',
    version: '0.1',
    titleHeight: 2.5,
    bodyHeight: 24.1,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Section 8 : Responsable atencion
  let section8 = await FUASectionService.create({
    title: '',
    showTitle: false,
    codeName: 'provider',
    version: '0.1',
    titleHeight: 1.0,
    bodyHeight: 44.0,
    FUAPageId: auxPages[0],
    createdBy: auxUser
  });

  // Filling Section 2
  const section2Filling = await fillSection2(auxUser, "0.1", section2.uuid);

  return {uuid: auxFormat.uuid}

};
