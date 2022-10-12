const db = require('../config/db');

const authModel = {
    register: (data) => {
        const {
            id,
            name,
            email,
            passwordHashed,
            phone,
            photo,
            verifyToken
        } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO users(id, name, email, password, phone, photo, verify_token)
                VALUES('${id}', '${name}', '${email}', '${passwordHashed}', '${phone}', '${photo}', '${verifyToken}')`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res)
                },
            );
        });
    },
    findby: (row, keyword) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM users WHERE ${row} = '${keyword}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                },
            );
        });
    },
};

module.exports = authModel;