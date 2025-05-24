import { FUASectionDto } from '../dtos/FUASectionDto';
import { PageRequest } from './PageRequest';

export interface FUASectionService {
    /**
     * Creates a new FUASection instance.
     * @param dto Data for the FUASection to create.
     */
    create(dto: FUASectionDto): Promise<void>;

    /**
     * Retrieves a FUASection by its unique identifier.
     * @param id UUID of the FUASection.
     */
    readById(id: string): Promise<FUASectionDto | null>;

    /**
     * Updates an existing FUASection.
     * @param id UUID of the FUASection to update.
     * @param dto New values for the FUASection.
     */
    update(id: string, dto: FUASectionDto): Promise<void>;

    /**
     * Deletes a FUASection by its unique identifier.
     * @param id UUID of the FUASection to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUASection records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUASectionDto[]>;
}
