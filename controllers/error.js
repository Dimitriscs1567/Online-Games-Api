exports.handleErrors = (error, req, res, next) => {
    return res.status(error.statusCode).json({
        error: error.message,
    });
}