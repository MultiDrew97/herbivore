export declare class CustomError extends Error {
    constructor(message?: string, cause?: any);
}
export declare class AuthorizationError extends CustomError {
    constructor(message?: string, reason?: Error);
}
export declare class DatabaseError extends CustomError {
    constructor(message?: string, reason?: Error);
}
export declare class ConnectionError extends DatabaseError {
    constructor(message?: string, reason?: Error);
}
export declare class ArgumentError extends CustomError {
    constructor(message?: string, reason?: Error);
}
export declare class AuthenticationError extends CustomError {
    constructor(message?: string, reason?: Error);
}
export declare class PropertyError extends CustomError {
    constructor(message?: string, reason?: Error);
}
export declare class NotYetImplementedError extends CustomError {
    constructor(message?: string);
}
export declare class NotFoundError extends CustomError {
    constructor(message?: string);
}
export declare class UpdateError extends CustomError {
    constructor(message?: string);
}
export declare class DeleteError extends CustomError {
    constructor(message?: string);
}
export declare class CreationError extends CustomError {
    constructor(message?: string);
}
