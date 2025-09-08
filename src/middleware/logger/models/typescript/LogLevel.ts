//
export enum Logger_LogLevel {
    // Very detailed debugging information
	TRACE = 'TRACE',
	// Technical information for developers
    DEBUG = 'DEBUG',
	// General information about normal operations
    INFO = 'INFO',
	// Something unexpected but not breaking the system
    WARN = 'WARN',
	// An error occurred but the system can still run
    ERROR = 'ERROR',
	// Critical error, system stability is compromised
    FATAL = 'FATAL'
}

