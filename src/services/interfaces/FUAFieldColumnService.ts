import { FUAFieldColumnDto } from '../dtos/FUAFieldColumnDto';
import { PageRequest } from './PageRequest';

export interface FUAFieldColumnService {
    /**
     * Creates a new FUAFieldColumn instance.
     * @param dto Data for the FUAFieldColumn to create.
     */
    create(dto: FUAFieldColumnDto): Promise<void>;

    /**
     * Retrieves a FUAFieldColumn by its unique identifier.
     * @param id UUID of the FUAFieldColumn.
     */
    readById(id: string): Promise<FUAFieldColumnDto | null>;

    /**
     * Updates an existing FUAFieldColumn.
     * @param id UUID of the FUAFieldColumn to update.
     * @param dto New values for the FUAFieldColumn.
     */
    update(id: string, dto: FUAFieldColumnDto): Promise<void>;

    /**
     * Deletes a FUAFieldColumn by its unique identifier.
     * @param id UUID of the FUAFieldColumn to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUAFieldColumn records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUAFieldColumnDto[]>;
}
