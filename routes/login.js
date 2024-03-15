const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');
const secretKey = config.email.dong;
const option = { expiresIn: '1h', algorithm: 'HS256' };

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

router.post('/', (req, res) => {
    const pass = req.body.pass;
    const email2 = req.body.email;

    connection.query('SELECT * FROM user_info WHERE email = ? AND password = ?', [email2, pass], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: '서버 오류' });
        } else if(results.length == 0){
            return res.status(300).json({ results : results });
        }

        // 로그인 성공 시 토큰 생성
        const email= results[0].email;
        const name = results[0].name;
        const phonenumber = results[0].phonenumber;
        const password = results[0].password;
        const PAYLOAD ={type : 'JWT', email, name, password, phonenumber};
        const SECRET_KEY = secretKey; // config에 담은 secret_key 정보
        const OPTION = option; 

        const token = jwt.sign(PAYLOAD, SECRET_KEY, OPTION);

        return res.status(200).json({ token });
    });
});

module.exports = router;