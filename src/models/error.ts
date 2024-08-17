// TODO: Refactor Implemntation
export default class ReadableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ReadableError";
	}
}
