import { FUAPageDto } from '../dtos/FUAPageDto';
import { PageRequest } from './PageRequest';

export interface FUAPageService {
    /**
     * Creates a new FUAPage instance.
     * @param dto Data for the FUAPage to create.
     */
    create(dto: FUAPageDto): Promise<void>;

    /**
     * Retrieves a FUAPage by its unique identifier.
     * @param id UUID of the FUAPage.
     */
    readById(id: string): Promise<FUAPageDto | null>;

    /**
     * Updates an existing FUAPage.
     * @param id UUID of the FUAPage to update.
     * @param dto New values for the FUAPage.
     */
    update(id: string, dto: FUAPageDto): Promise<void>;

    /**
     * Deletes a FUAPage by its unique identifier.
     * @param id UUID of the FUAPage to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FUAPage records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FUAPageDto[]>;
}
