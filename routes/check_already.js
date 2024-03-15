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
    console.log("check already")
    connection.query('SELECT * FROM user_info WHERE email = ?',[email],  function(err, results) {
        if(err){
            console.log(err);
            return res.status(400).json({ error : err });
        } 
        if(results.length > 0){
            return res.status(300).json( {results :results });
        }
            return res.status(200).json( {results :results });
        }
    );
});

module.exports = router;