import { FUAFieldRowDto } from '../dtos/FUAFieldRowDto';
import { PageRequest } from './PageRequest';

export interface FUAFieldRowService {
    /**
     * Creates a new FUAFieldRow instance.
     * @param dto Data for the FUAFieldRow to create.
     */
    create(dto: FUAFieldRowDto): Promise<void>;

    /**
     * Retrieves a FUAFieldRow by its unique identifier.
     * @param id UUID of the FUAFieldRow.
     */
    readById(id: string): Promise<FUAFieldRowDto | null>;

    /**
     * Updates an existing FUAFieldRow.
     * @param id UUID of the FUAFieldRow to update.
     * @param dto New values for the FUAFieldRow.
     */
    update(id: string, dto: FUAFieldRowDto): Promise<void>;

    /**
     * Deletes a FUAFieldRow by its unique identifier.
     * @param id UUID of the FUAFieldRow to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUAFieldRow records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUAFieldRowDto[]>;
}
