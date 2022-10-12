const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const jwtToken = require('../helpers/generateJWTToken');
const { success, failed } = require('../helpers/response');
const authModel = require('../models/auth.models');

const authController = {
    register: async (req, res) => {
        console.log('req: ', req.body)
        try {
            const { name, email, password } = req.body
            const emailCheck = await authModel.findby('email', email)
            if (emailCheck.rowCount == 0) {
                const id = uuidv4();
                const passwordHashed = await bcrypt.hash(password, 10);
                const photo = 'user_default.png';
                const phone = ''
                const verifyToken = crypto.randomBytes(16).toString('hex');
                const data = {
                    id,
                    name,
                    email,
                    passwordHashed,
                    phone,
                    photo,
                    verifyToken
                };
                await authModel.register(data);
                success(res, {
                    code: 200,
                    status: 'success',
                    message: 'register success',
                    data: data
                });
            } else {
                const err = {
                    message: 'email is already registered'
                };
                failed(res, {
                    code: 400,
                    status: 'error',
                    message: err.message,
                    error: [],
                });
                return;
            }
        } catch (error) {
            failed(res, {
                code: 500,
                status: 'error',
                message: error,
                error: [],
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isRegistered = await authModel.findby('email', email)
            console.log('isRegistered: ', isRegistered)
            console.log('req: ', req.body)
            if (isRegistered.rowCount > 0) {
                bcrypt
                    .compare(password, isRegistered.rows[0].password)
                    .then(async (match) => {
                        if (match) {
                            const token = await jwtToken({
                                id: isRegistered.rows[0].id,
                            });
                            success(res, {
                                code: 200,
                                status: 'success',
                                message: 'login success',
                                token: token,
                            });
                        } else {
                            success(res, {
                                code: 500,
                                status: 'error',
                                message: 'wrong email or password',
                                error: [],
                            });
                        }
                    });

            } else {
                failed(res, {
                    code: 404,
                    status: 'error',
                    message: 'email not registered',
                    error: [],
                });
            }
        } catch (error) {
            failed(res, {
                code: 500,
                status: 'error',
                message: error.message,
                error: [],
            });
        }
    },

}

module.exports = authController;