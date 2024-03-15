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
    const name = req.body.name;
    const phone = req.body.phone;
    const pass = req.body.pass;
    const email = req.body.email;
    connection.query('INSERT INTO user_info (email, name, password, phonenumber) VALUES (?, ?, ?, ?)', [email, name, pass, phone], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '서버 오류' });
        } 
        console.log('성공');
        return res.status(200).json({results : results});
    });
});

module.exports = router;