const express = require('express');
const mysql = require('mysql2');
const router = express.Router();


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

router.post('/', (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass; // 수정: req.body.pass로 수정

    console.log("reset password called");

    // 수정된 SQL 쿼리: user_info 테이블에서 이메일이 req.body.email과 일치하는 행의 비밀번호를 req.body.pass로 업데이트
    connection.query('UPDATE user_info SET password = ? WHERE email = ?', [pass, email], function(err, results) {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        } 
        if (results.affectedRows === 0) {
            console.log('Has never registered!');
            return res.status(500).json({ message: 'Has never registered!' });
        }
        console.log('Password reset successfully!');
        return res.status(200).json({ message: 'Password reset successfully!' });
    });
});

module.exports = router;