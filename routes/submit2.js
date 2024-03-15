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
    console.log('submit2 called')
    const place = req.body.placeName; 
    const name = req.body.name;
    const email = req.body.email;
    connection.query('SELECT * FROM applylist WHERE email = ? and place = ? and name = ?', [email, place, name], function(err, results) {
            if (err) {
                console.error(err);
            }
            if (results.length >=1) {
                return res.status(300).json({ error: '정원이 가득 찼습니다.' });
            } 
            res.status(200).json({ error: '정원이 가득 찼습니다.' }); //성공
    });
});

module.exports = router;