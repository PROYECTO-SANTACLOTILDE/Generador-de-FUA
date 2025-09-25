import { inspect } from 'util';
import { isStrictIntegerString } from '../utils/utils';
import { Op } from 'sequelize';
require('dotenv').config();


export type SimplePaginationParams = {
  baseEntityPaginationParams?: any;
  page?: number;      
  pageSize?: number;
  maxPageSize?: number;    
  order?: any;    
};

export type SimplePaginationResult = {
  rows: any[];         
  total: number;     
  pages: number;       
  pageParsed: number;       
  pageSizeParsed: number;   
  hasMore: boolean;    
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

// wrapper who receives a sequelize who receive parameters from the controller and prepares a sequelize object for findAndCountAll()
export async function paginateSimple(model: any, options: SimplePaginationParams = {}): Promise<SimplePaginationResult> {

    if(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE != undefined){
      if (Number.isNaN(parseInt(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE))){
        throw new Error(`DEFAULT_MAX_PAGINATION_PAGE_SIZE env. variable is not a number.`);
      }else {
        DEFAULT_MAX_PAGE_SIZE = parseInt(process.env.DEFAULT_MAX_PAGINATION_PAGE_SIZE);
      }
    }

    const pageParsed = parsePageParam(options.page, DEFAULT_PAGE, "page");
    let pageSizeParsed = parsePageParam(options.pageSize, DEFAULT_PAGE_SIZE, "pageSize");

    const maxPageSize = options.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE;
    if (pageSizeParsed > maxPageSize) pageSizeParsed = maxPageSize;

    const offset = (pageParsed - 1) * pageSizeParsed;
    const order = options.order ?? [['createdAt', 'ASC']];
    
    // creation of the time range according to the afterInactive and beforeInactive parameters 
    if (options.baseEntityPaginationParams.afterInactiveAt != null && options.baseEntityPaginationParams.beforeInactiveAt != null){
      const range = {[Op.between]: [new Date(options.baseEntityPaginationParams.afterInactiveAt), new Date(options.baseEntityPaginationParams.beforeInactiveAt)]}
      options.baseEntityPaginationParams.inactiveAt = range;
    }else if (options.baseEntityPaginationParams.afterInactiveAt != null) {
      const range = {[Op.gte]: new Date(options.baseEntityPaginationParams.afterInactiveAt)};
      options.baseEntityPaginationParams.inactiveAt = range;
    }else if (options.baseEntityPaginationParams.beforeInactiveAt != null){
      const range = {[Op.lte]: new Date(options.baseEntityPaginationParams.beforeInactiveAt)};
      options.baseEntityPaginationParams.inactiveAt = range;
    }

    console.log(options.baseEntityPaginationParams.includeInactive);
    // default value for the active parameter with the includeInactive condition
    if (options.baseEntityPaginationParams.includeInactive == true){
      options.baseEntityPaginationParams.active = null;
      console.log(options.baseEntityPaginationParams.includeInactive);
      console.log(options.baseEntityPaginationParams.active);
      console.log(1);
    }
    else {
      options.baseEntityPaginationParams.active = options.baseEntityPaginationParams.active ?? true;
      console.log(options.baseEntityPaginationParams.active);
      console.log(2);
    }

    // we erase those parameters because not recognize by sequelize (not present in the database)
    options.baseEntityPaginationParams.includeInactive = null;
    options.baseEntityPaginationParams.afterInactiveAt = null;
    options.baseEntityPaginationParams.beforeInactiveAt = null;

    const filteredBaseEntityPaginationParams = Object.fromEntries(
      Object.entries(options.baseEntityPaginationParams).filter(([_, v]) => v != null)
    );

    const findOptions: any = {
        where: filteredBaseEntityPaginationParams,
        limit: pageSizeParsed,
        offset,
        order,
    };

    let result  = null;
    try{
        result = await model.findAndCountAll(findOptions);

    }catch(err: any){
        (err as Error).message =  'Error in FUA Format From Schema Sequelize Implementation: Couldnt list all FUA Format From Schema in database using Sequelize. ' + (err as Error).message;
        const line = inspect(err, { depth: 100, colors: false });
        err.details = line.replace(/^/gm, '\t');     
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