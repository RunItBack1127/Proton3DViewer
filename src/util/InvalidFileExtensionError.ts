const INVALID_FILE_ERROR_MESSAGE = "Proton does not currently support files with this extension.";

export class InvalidFileExtensionError extends Error {
    constructor() {
        super( INVALID_FILE_ERROR_MESSAGE );
    }
};