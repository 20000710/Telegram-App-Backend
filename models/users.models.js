const db = require('../config/db');

const usersModel = {
    allData: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM users`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAllUsers: (
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
    ) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM users WHERE LOWER(name) LIKE '%${searchQuery}%'
          ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    detail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    usersUpdateData: (data) => {
        const { id, name, email, phone } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET name='${name}', email='${email}', phone='${phone}'
            WHERE id='${id}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    usersUpdatePhotoData: (data) => {
        const { id, photo } = data;
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET photo='${photo}' WHERE id='${id}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    usersDeleteData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `
            DELETE FROM users WHERE id='${id}'
            `,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
}

module.exports = usersModel;