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
    console.log('Tour detail called')
    const place = req.body.place;
    connection.query('SELECT review FROM tourdetail WHERE place = ? ORDER BY reviewNum ',[place],  function(err, results) {
        if(err){
            console.log(err);
            return res.status(400).json({ error : err });
        } else {
            return res.status(200).json( {review :results});
        }
    });
});

module.exports = router;