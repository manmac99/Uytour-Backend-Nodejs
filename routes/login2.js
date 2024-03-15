const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const dm = config.email.dm;
const dp = config.email.dp;
const dn = config.email.dn;
const dpn = config.email.dpn;

router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.pass;
    console.log(email);
    console.log(password);

    if(email == dm && password == dp){
        return res.status(200).json({ name :dn, email : dm, phonenumber : dpn});
    }
    

    // 데이터베이스에서 이메일과 비밀번호로 사용자 조회
    connection.query('SELECT * FROM user_info WHERE email = ? AND password = ?', [email, password], function(err, results) {
        if (err) {
            console.error(err);
            console.log("Send 400")
            return res.status(400).json({ error: '서버 오류' });
        } else if(results.length == 0){
            console.log(results);
            console.log("Send 300")
            return res.status(300).json({ error: '사용자를 찾을 수 없습니다.' });
        }
        console.log("Send 200")
        // // 로그인 성공 시 새로운 토큰 생성
        const email2 = results[0].email;
        const name = results[0].name;
        const phonenumber = results[0].phonenumber;

        return res.status(200).json({ name :name, email : email2, phonenumber : phonenumber});
    });
});

module.exports = router;