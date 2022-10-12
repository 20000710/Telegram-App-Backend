// import env
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/env');

const { failed } = require('../helpers/response');

module.exports = (req, res, next) => {
    try {
        const { token } = req.headers;

        const decoded = jwt.verify(token, JWT_SECRET);
        req.APP_DATA = {
            tokenDecoded: decoded,
        };
        next();
    } catch (error) {
        failed(res, {
            code: 500,
            status: 'error',
            message: error.message,
            error: [],
        });
        return;
    }
};