import { FUAFieldCellDto } from '../dtos/FUAFieldCellDto';
import { PageRequest } from './PageRequest';

export interface FUAFieldCellService {
    /**
     * Creates a new FUAFieldCell instance.
     * @param dto Data for the FUAFieldCell to create.
     */
    create(dto: FUAFieldCellDto): Promise<void>;

    /**
     * Retrieves a FUAFieldCell by its unique identifier.
     * @param id UUID of the FUAFieldCell.
     */
    readById(id: string): Promise<FUAFieldCellDto | null>;

    /**
     * Updates an existing FUAFieldCell.
     * @param id UUID of the FUAFieldCell to update.
     * @param dto New values for the FUAFieldCell.
     */
    update(id: string, dto: FUAFieldCellDto): Promise<void>;

    /**
     * Deletes a FUAFieldCell by its unique identifier.
     * @param id UUID of the FUAFieldCell to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUAFieldCell records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUAFieldCellDto[]>;
}
