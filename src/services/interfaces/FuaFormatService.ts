import { FuaFormatDto } from '../dtos/FuaFormatDto';
import { PageRequest } from './PageRequest';

export interface FuaFormatService {
    /**
     * Creates a new FuaFormat instance.
     * @param dto Data for the FuaFormat to create.
     */
    create(dto: FuaFormatDto): Promise<void>;

    /**
     * Retrieves a FuaFormat by its unique identifier.
     * @param id UUID of the FuaFormat.
     */
    readById(id: string): Promise<FuaFormatDto | null>;

    /**
     * Updates an existing FuaFormat.
     * @param id UUID of the FuaFormat to update.
     * @param dto New values for the FuaFormat.
     */
    update(id: string, dto: FuaFormatDto): Promise<void>;

    /**
     * Deletes a FuaFormat by its unique identifier.
     * @param id UUID of the FuaFormat to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists FuaFormat records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<FuaFormatDto[]>;
}
