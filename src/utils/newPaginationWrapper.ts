import { inspect } from 'util';
import { isStrictIntegerString } from '../utils/utils';
import { parseAs } from '../utils/utils';
import { Op } from 'sequelize';
import FUAFormatFromSchemaService from '../services/FUAFormatFromSchemaService';
require('dotenv').config();



export type SimplePaginationResult = {
  rows: any[];         
  total: number;     
  pages: number;       
  pageParsed: number;       
  pageSizeParsed: number;   
  hasMore: boolean;    
};

export type paginationParams = {
    page?: any;
    pageSize?: any;
    maxPageSize?: any;    
    order?: any; 
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
let DEFAULT_MAX_PAGE_SIZE = 100;


function parsePageParam(raw: string | number | undefined, defaultValue: number, paramName: "page" | "pageSize"): number {
  if (raw === undefined || raw === null) return defaultValue;

  if (typeof raw === "number") {
    const n = Math.floor(raw);
    if (n <= 0) throw new Error(`Bad '${paramName}' value.`);
    return n;
  }

  if (typeof raw === "string") {
    if (!isStrictIntegerString(raw)) throw new Error(`Bad '${paramName}' argument.`);
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) throw new Error(`Bad '${paramName}' value.`);
    return n;
  }

  throw new Error(`Bad '${paramName}' argument type.`);
}

// query attrubutes wraping function
export async function paginationWrapper(paginationParams: paginationParams, baseEntityPaginationParams: any): Promise<SimplePaginationResult>{
    
    baseEntityPaginationParams.id = parseAs(baseEntityPaginationParams.id, 'integer');
    baseEntityPaginationParams.uuid = parseAs(baseEntityPaginationParams.uuid, 'string');
    baseEntityPaginationParams.createdBy = parseAs(baseEntityPaginationParams.createdBy, 'string');
    baseEntityPaginationParams.updatedBy = parseAs(baseEntityPaginationParams.updatedBy, 'string');
    baseEntityPaginationParams.active = parseAs(baseEntityPaginationParams.active, 'boolean');
    baseEntityPaginationParams.includeInactive = parseAs(baseEntityPaginationParams.includeInactive, 'boolean');
    baseEntityPaginationParams.inactiveBy = parseAs(baseEntityPaginationParams.inactiveBy, 'boolean');
    baseEntityPaginationParams.beforeInactiveAt = parseAs(baseEntityPaginationParams.beforeInactiveAt, 'string');
    baseEntityPaginationParams.afterInactiveAt = parseAs(baseEntityPaginationParams.afterInactiveAt, 'string');
    baseEntityPaginationParams.inactiveReason = parseAs(baseEntityPaginationParams.inactiveReason, 'string');
    baseEntityPaginationParams.beforeCreatedAt =  parseAs(baseEntityPaginationParams.beforeCreatedAt, 'string');
    baseEntityPaginationParams.afterCreatedAt =  parseAs(baseEntityPaginationParams.afterCreatedAt, 'string');
    baseEntityPaginationParams.beforeUpdatedAt = parseAs(baseEntityPaginationParams.beforeUpdatedAt, 'string');
    baseEntityPaginationParams.afterUpdatedAt = parseAs(baseEntityPaginationParams.afterUpdatedAt, 'string');

    if(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE != undefined){
      if (Number.isNaN(parseInt(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE))){
        throw new Error(`DEFAULT_MAX_PAGINATION_PAGE_SIZE env. variable is not a number.`);
      }else {
        DEFAULT_MAX_PAGE_SIZE = parseInt(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE);
      }
    }

    const pageParsed = parsePageParam(paginationParams.page, DEFAULT_PAGE, "page");
    let pageSizeParsed = parsePageParam(paginationParams.pageSize, DEFAULT_PAGE_SIZE, "pageSize");

    const maxPageSize = paginationParams.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE;
    if (pageSizeParsed > maxPageSize) pageSizeParsed = maxPageSize;

    const offset = (pageParsed - 1) * pageSizeParsed;
    const order = paginationParams.order ?? [['createdAt', 'ASC']];

    // creation of the time range according to the afterInactiveAt and beforeInactiveAt parameters 
    if (baseEntityPaginationParams.afterInactiveAt != null && baseEntityPaginationParams.beforeInactiveAt != null){
      const range = {[Op.between]: [new Date(baseEntityPaginationParams.afterInactiveAt), new Date(baseEntityPaginationParams.beforeInactiveAt)]}
      baseEntityPaginationParams.inactiveAt = range;
    }else if (baseEntityPaginationParams.afterInactiveAt != null) {
      const range = {[Op.gte]: new Date(baseEntityPaginationParams.afterInactiveAt)};
      baseEntityPaginationParams.inactiveAt = range;
    }else if (baseEntityPaginationParams.beforeInactiveAt != null){
      const range = {[Op.lte]: new Date(baseEntityPaginationParams.beforeInactiveAt)};
      baseEntityPaginationParams.inactiveAt = range;
    }


    // creation of the time range according to the afterCreatedAt and beforeCreatedAt parameters 
    if (baseEntityPaginationParams.afterCreatedAt != null && baseEntityPaginationParams.beforeICreatedAt != null){
      const range = {[Op.between]: [new Date(baseEntityPaginationParams.afterCreatedAt), new Date(baseEntityPaginationParams.beforeCreatedAt)]}
      baseEntityPaginationParams.createdAt = range;
    }else if (baseEntityPaginationParams.afterCreatedAt != null) {
      const range = {[Op.gte]: new Date(baseEntityPaginationParams.afterCreatedAt)};
      baseEntityPaginationParams.createdAt = range;
    }else if (baseEntityPaginationParams.beforeCreatedAt != null){
      const range = {[Op.lte]: new Date(baseEntityPaginationParams.beforeCreatedAt)};
      baseEntityPaginationParams.createdAt = range;
    }

    // creation of the time range according to the afterUpdatedAt and beforeUpdatedAt parameters 
    if (baseEntityPaginationParams.afterUpdatedAt != null && baseEntityPaginationParams.beforeIUpdatedAt != null){
      const range = {[Op.between]: [new Date(baseEntityPaginationParams.afterUpdatedAt), new Date(baseEntityPaginationParams.beforeUpdatedAt)]}
      baseEntityPaginationParams.updatedAt = range;
    }else if (baseEntityPaginationParams.afterUpdatedAt != null) {
      const range = {[Op.gte]: new Date(baseEntityPaginationParams.afterUpdatedAt)};
      baseEntityPaginationParams.updatedAt = range;
    }else if (baseEntityPaginationParams.beforeUpdatedAt != null){
      const range = {[Op.lte]: new Date(baseEntityPaginationParams.beforeUpdatedAt)};
      baseEntityPaginationParams.updatedAt = range;
    }


    // default value for the active parameter with the includeInactive condition
    if (baseEntityPaginationParams.includeInactive == true){
      baseEntityPaginationParams.active = null;
    }else {
      baseEntityPaginationParams.active = baseEntityPaginationParams.active ?? true;
    }

    // we erase those parameters because not recognize by sequelize (not present in the database)
    baseEntityPaginationParams.includeInactive = null;
    baseEntityPaginationParams.afterInactiveAt = null;
    baseEntityPaginationParams.beforeInactiveAt = null;
    baseEntityPaginationParams.afterCreatedAt = null;
    baseEntityPaginationParams.beforeCreatedAt = null;
    baseEntityPaginationParams.afterUpdatedAt = null;
    baseEntityPaginationParams.beforeUpdatedAt = null;

    const filteredBaseEntityPaginationParams = Object.fromEntries(
      Object.entries(baseEntityPaginationParams).filter(([_, v]) => v != null)
    );

    const findOptions: any = {
        where: filteredBaseEntityPaginationParams,
        limit: pageSizeParsed,
        offset,
        order,
    };

    let result  = null;
    try{
        result = await FUAFormatFromSchemaService.listAll(findOptions);
    }catch(err: any){
        (err as Error).message =  'Error in newPaginationWrapper: erorr with the listAll Service call :' + (err as Error).message;   
        throw err;
    }

    let total = 0;
    if (typeof result.count === 'number') {
        total = result.count;
    } else if (result.count && typeof result.count === 'object' && 'count' in result.count) {

        total = Number((result.count as any).count) || 0;
    } else {
        total = 0;
    }

    const rows = result.rows ?? [];
    const pages = total === 0 ? 1 : Math.ceil(total / pageSizeParsed);

    if (pageParsed > pages) {
        throw new Error(
            `Pagination error: requested page ${pageParsed} exceeds total pages ${pages}`
            );
    }

    const hasMore = offset + (rows.length || 0) < total;

    return {
        rows,
        total,
        pages,
        pageParsed,
        pageSizeParsed,
        hasMore
    };
}