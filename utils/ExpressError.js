class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the parent constructor
        this.statusCode = statusCode; // Set the status code
        this.message = message; // Set the error message
    }
}

module.exports = ExpressError;
