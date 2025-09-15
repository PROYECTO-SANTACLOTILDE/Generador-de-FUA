import { FUAField, FUASection } from "../modelsSequelize";
import FUAFieldColumnService from "../services/FUAFieldColumnService";
import FUAFieldService from "../services/FUAFieldService";
import FUAFormatService from "../services/FUAFormatService";
import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";

const crypto = require('crypto');
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'jsonc-parser';
import FUARenderingUtils from "./FUARendering";
import FUAFormat from "../modelsTypeScript/FUAFormat";


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

  //Fill with a field with Dia, Mes, Año
  /* const DiaColumn = await FUAFieldColumnService.create({
    label: "DIA",
    showLabel
  }); */


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

export async function createDemoFormat(printMode : boolean){
  try{
    const jsoncPath = path.resolve(process.cwd(), "./src/utils/FUA_Schema_Examples/Constructor_Test.jsonc");
    const jsoncContent = fs.readFileSync(jsoncPath, 'utf-8');
    const parsed = parse(jsoncContent);
    let auxFormat = await new FUAFormat(parsed);

    let html : string = '';

    //htm
  
    html = await FUARenderingUtils.renderFUAFormatFromSchema(parsed, printMode);
    return html
  }catch(error: unknown){
    console.error('Error in Utils - createDemoFormat: ', error);
    (error as Error).message =  'Error in Utils - createDemoFormat: ' + (error as Error).message;
    throw error;
  }
  ;
};

// Dedent tabulations for strings declared with ´´
export function dedentCustom(str: string): string {
  if(str === null || str == undefined){
    throw new Error("Error in Utils - dedentCustom: string received should not be null. ");
  }
  const lines = str.split('\n');

  // Find the first non-empty line with tabs (after any initial empty lines)
  const firstIndentedLine = lines.find(line => line.trim().length > 0);
  if (!firstIndentedLine) return str.trim(); // no valid content

  // Count leading tabs in the first non-empty line
  const tabMatch = firstIndentedLine.match(/^(\t+)/);
  const tabCount = tabMatch ? tabMatch[1].length : 0;

  // Remove exactly that many leading tabs from all lines
  const dedented = lines.map(line => {
      let i = 0;
      while (i < tabCount && line.startsWith('\t')) {
        line = line.slice(1);
        i++;
      }
      return line;
  });

  return dedented.join('\n').trim();

}

// Remove the background-color attribut when printing rendering
export function removeBackgroundColor(inlineStyle?: string): string {
  if (inlineStyle == undefined || inlineStyle == null){
    return ''
  }
  return inlineStyle
    .split(";")
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0 && !/^background-color\s*:/i.test(rule))
    .join("; ");
}
