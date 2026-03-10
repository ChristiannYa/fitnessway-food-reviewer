export class ApiRequestBaseError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiRequestBaseError";
		this.status = status;
	}
}

export class PxyRequestBaseError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "PxyRequestBaseError";
		this.status = status;
	}
}
