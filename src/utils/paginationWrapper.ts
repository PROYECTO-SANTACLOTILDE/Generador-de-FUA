import { inspect } from 'util';
import { isStrictIntegerString } from '../utils/utils';


export type SimplePaginationParams = {
  page?: number;      
  pageSize?: number;
  maxPageSize?: number;
  where?: any;      
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
const DEFAULT_MAX_PAGE_SIZE = 100;


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


export async function paginateSimple(model: any, options: SimplePaginationParams = {}): Promise<SimplePaginationResult> {

    const pageParsed = parsePageParam(options.page, DEFAULT_PAGE, "page");
    let pageSizeParsed = parsePageParam(options.pageSize, DEFAULT_PAGE_SIZE, "pageSize");

    const maxPageSize = options.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE;
    if (pageSizeParsed > maxPageSize) pageSizeParsed = maxPageSize;

    const offset = (pageParsed - 1) * pageSizeParsed;
    const order = options.order ?? [['createdAt', 'ASC']];

    const findOptions: any = {
        where: options.where ?? {},
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