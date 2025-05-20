import { FUAFieldDto } from '../dtos/FUAFieldDto';
import { PageRequest } from './PageRequest';

export interface FUAFieldService {
    /**
     * Creates a new FUAField instance.
     * @param dto Data for the FUAField to create.
     */
    create(dto: FUAFieldDto): Promise<void>;

    /**
     * Retrieves a FUAField by its unique identifier.
     * @param id UUID of the FUAField.
     */
    readById(id: string): Promise<FUAFieldDto | null>;

    /**
     * Updates an existing FUAField.
     * @param id UUID of the FUAField to update.
     * @param dto New values for the FUAField.
     */
    update(id: string, dto: FUAFieldDto): Promise<void>;

    /**
     * Deletes a FUAField by its unique identifier.
     * @param id UUID of the FUAField to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUAField records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUAFieldDto[]>;
}
