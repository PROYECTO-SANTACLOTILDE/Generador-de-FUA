
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
  page: number;       
  pageSize: number;   
  hasMore: boolean;    
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MAX_PAGE_SIZE = 100;


export async function paginateSimple(model: any, options: SimplePaginationParams = {}): Promise<SimplePaginationResult> {
 
  const page = Math.max(1, Math.floor(options.page ?? DEFAULT_PAGE));
  let pageSize = Math.max(1, Math.floor(options.pageSize ?? DEFAULT_PAGE_SIZE));
  const maxPageSize = options.maxPageSize ?? DEFAULT_MAX_PAGE_SIZE;
  if (pageSize > maxPageSize) pageSize = maxPageSize;

  const offset = (page - 1) * pageSize;
  const order = options.order ?? [['createdAt', 'DESC']];

  const findOptions: any = {
    where: options.where ?? {},
    limit: pageSize,
    offset,
    order,
  };

  // Adding try/catch and throw error + specific message
  const result = await model.findAndCountAll(findOptions);


  let total = 0;
  if (typeof result.count === 'number') {
    total = result.count;
  } else if (result.count && typeof result.count === 'object' && 'count' in result.count) {

    total = Number((result.count as any).count) || 0;
  } else {
    total = 0;
  }

  const rows = result.rows ?? [];
  const pages = total === 0 ? 1 : Math.ceil(total / pageSize);

    if (page > pages) {
    throw new Error(
        `Pagination error: requested page ${page} exceeds total pages ${pages}`
        );
    }

  const hasMore = offset + (rows.length || 0) < total;

  return {
    rows,
    total,
    pages,
    page,
    pageSize,
    hasMore
  };
}