import { UserDto } from '../dtos/UserDto';
import { PageRequest } from './PageRequest';

export interface UserService {
    /**
     * Creates a new User instance.
     * @param dto Data for the User to create.
     */
    create(dto: UserDto): Promise<void>;

    /**
     * Retrieves a User by its unique identifier.
     * @param id UUID of the User.
     */
    readById(id: string): Promise<UserDto | null>;

    /**
     * Updates an existing User.
     * @param id UUID of the User to update.
     * @param dto New values for the User.
     */
    update(id: string, dto: UserDto): Promise<void>;

    /**
     * Deletes a User by its unique identifier.
     * @param id UUID of the User to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Lists User records with optional pagination.
     * @param pageRequest Pagination configuration.
     */
    list(pageRequest: PageRequest): Promise<UserDto[]>;
}
