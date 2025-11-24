export class CustomError extends Error {
	constructor(message?: string, cause?: any) {
		super(message)
		this.cause = cause
	}
}

export class AuthorizationError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class DatabaseError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class ConnectionError extends DatabaseError {
	constructor(message?: string) {
		super(message)
	}
}

export class ArgumentError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class AuthenticationError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class PropertyError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class NotYetImplementedError extends CustomError {
	constructor(message?: string) {
		super(message ?? 'Property has not yet been implemented')
	}
}

export class NotFoundError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class UpdateError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class DeleteError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}

export class CreationError extends CustomError {
	constructor(message?: string) {
		super(message)
	}
}
