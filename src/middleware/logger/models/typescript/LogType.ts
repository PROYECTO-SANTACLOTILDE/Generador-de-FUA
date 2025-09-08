
export enum Logger_LogType {
    // A new resource was created
	CREATE = 'CREATE',
	// A resource was accessed or consulted
    READ = 'READ',
    // A file was edited or modified
    EDIT = 'EDIT',
	// A file or data was uploaded
    UPLOAD = 'UPLOAD',
	// A resource was deleted
    DELETE = 'DELETE',
    // Action did by the system itlself
    SYSTEM = 'SYSTEM'
}

