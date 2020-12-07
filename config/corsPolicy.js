exports.setCorsHeaders = (req, res, next) => {
    res.setHeader('Access-Contol-Allow-Origin', '*');
    res.setHeader('Access-Contol-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Contol-Allow-Headers', 'Content-Type, Authorization');
    next();
}