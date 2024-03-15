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
    const place = req.body.place;
    const name = req.body.name;
    const email = req.body.email;
    console.log("check called")
    connection.query('SELECT * FROM applylist WHERE place = ? AND email = ? AND name = ? ORDER BY NUM', [place, email, name] ,function(err, results) {
        if(err){
            console.log(err);
            return res.status(400).json({ error : err });
        } 
        if(results.length>=1){
            return res.status(200).json( {results : results});
        } else{
            return res.status(500).json( {results : results});
        }
        }
    );
});

module.exports = router;