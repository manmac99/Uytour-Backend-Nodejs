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
    console.log('submit called') 
    const place = req.body.placeName; 
    connection.query('SELECT People_want, People_Real FROM new_tour WHERE Name = ? limit 1', [place], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: '정원이 가득 찼습니다.' });
            }
            if (!results.length || results[0]['People_want'] === results[0]['People_Real']) {
                return res.status(300).json({ error: '정원이 가득 찼습니다.' });
            } 
            return res.status(200).json({ error: '정원이 가득 찼습니다.' }); //성공
    });
});

module.exports = router;