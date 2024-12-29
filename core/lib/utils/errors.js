"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationError = exports.DeleteError = exports.UpdateError = exports.NotFoundError = exports.NotYetImplementedError = exports.PropertyError = exports.AuthenticationError = exports.ArgumentError = exports.ConnectionError = exports.DatabaseError = exports.AuthorizationError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
    }
}
exports.CustomError = CustomError;
class AuthorizationError extends CustomError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.AuthorizationError = AuthorizationError;
class DatabaseError extends CustomError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.DatabaseError = DatabaseError;
class ConnectionError extends DatabaseError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.ConnectionError = ConnectionError;
class ArgumentError extends CustomError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.ArgumentError = ArgumentError;
class AuthenticationError extends CustomError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.AuthenticationError = AuthenticationError;
class PropertyError extends CustomError {
    constructor(message, reason) {
        super(message, reason);
    }
}
exports.PropertyError = PropertyError;
class NotYetImplementedError extends CustomError {
    constructor(message) {
        super(message ?? 'Property has not yet been implemented');
    }
}
exports.NotYetImplementedError = NotYetImplementedError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
class UpdateError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.UpdateError = UpdateError;
class DeleteError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.DeleteError = DeleteError;
class CreationError extends CustomError {
    constructor(message) {
        super(message);
    }
}
exports.CreationError = CreationError;
