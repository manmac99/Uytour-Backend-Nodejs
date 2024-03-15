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
    const vericode = req.body.vericode;
    console.log('check vericode called')
    
    connection.query('SELECT email, vericode FROM temp_user WHERE email = ? ORDER BY idtemp_user DESC LIMIT 1', [email], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '서버 오류' });
        }

        if (results.length === 0) {
            // 해당 이메일로 등록된 인증정보가 없는 경우
            return res.status(400).json({ error: '인증정보가 일치하지 않습니다.' });
        }

        const storedEmail = results[0].email;
        const storedVericode = results[0].vericode;

        if (email === storedEmail && vericode === storedVericode) {
            // 요청된 이메일과 인증코드가 일치하는 경우
            return res.status(200).json({ message: '인증 성공' });
        } else {
            // 요청된 이메일과 인증코드가 일치하지 않는 경우
            return res.status(400).json({ error: '인증정보가 일치하지 않습니다.' });
        }
    });
});

module.exports = router;