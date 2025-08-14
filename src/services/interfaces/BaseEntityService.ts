import { BaseEntityDto } from '../dtos/BaseEntityDto';
import { PageRequest } from './PageRequest';

export interface BaseEntityService {
    /**
     * Creates a new BaseEntity instance.
     * @param dto Data for the BaseEntity to create.
     */
    create(dto: BaseEntityDto): Promise<void>;

    /**
     * Retrieves a BaseEntity by its unique identifier.
     * @param id UUID of the BaseEntity.
     */
    readById(id: string): Promise<BaseEntityDto | null>;

    /**
     * Updates an existing BaseEntity.
     * @param id UUID of the BaseEntity to update.
     * @param dto New values for the BaseEntity.
     */
    update(id: string, dto: BaseEntityDto): Promise<void>;

    /**
     * Deletes a BaseEntity by its unique identifier.
     * @param id UUID of the BaseEntity to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists BaseEntity records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<BaseEntityDto[]>;
}
