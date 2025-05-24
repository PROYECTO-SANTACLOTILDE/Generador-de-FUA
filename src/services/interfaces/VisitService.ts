import { VisitDto } from '../dtos/VisitDto';
import { PageRequest } from './PageRequest';

export interface VisitService {
    /**
     * Creates a new Visit instance.
     * @param dto Data for the Visit to create.
     */
    create(dto: VisitDto): Promise<void>;

    /**
     * Retrieves a Visit by its unique identifier.
     * @param id UUID of the Visit.
     */
    readById(id: string): Promise<VisitDto | null>;

    /**
     * Updates an existing Visit.
     * @param id UUID of the Visit to update.
     * @param dto New values for the Visit.
     */
    update(id: string, dto: VisitDto): Promise<void>;

    /**
     * Deletes a Visit by its unique identifier.
     * @param id UUID of the Visit to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists Visit records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<VisitDto[]>;
}
