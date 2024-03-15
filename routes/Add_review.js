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
    const review = req.body.review;
    const name = req.body.name;
    console.log("Add review called")
    connection.query('INSERT INTO pastreview (place, review,  who) VALUES (?, ?, ?)', [place,review,name] ,function(err, results) {
        if(err){
            console.log(err);
            return res.status(400).json({ error : err });
        } 
        else{
            return res.status(200).json( {results : results});
        } 
    });
});

module.exports = router;