function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next); // Catch any errors and pass them to the next middleware
    };
}

module.exports = wrapAsync;