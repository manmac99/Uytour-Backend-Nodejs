const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { type } = require('os');


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const jinUser = config.email.jin;



const app = express();
const PORT = 80;

app.use(bodyParser.json());
app.use(cors());

function convertTextToHTML(text) {
    // \n을 <br>로 변환
    return text.replace(/\n/g, '<br>');
  }


app.get('/', (req, res) => {
    
    const htmlContent = `
    <!DOCTYPE html>
<html>
<head>
    <title>우연 투어 - 새로운 인연을 만나는 여행</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }

        header {
            background-color: #3498db;
            color: #fff;
            text-align: center;
            padding: 20px 0;
        }

        h1 {
            margin: 0;
        }

        section {
            max-width: 800px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #3498db;
        }

        p {
            line-height: 1.6;
        }

        a {
            display: inline-block;
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }

        footer {
            text-align: center;
            padding: 10px 0;
            background-color: #3498db;
            color: #fff;
        }
    </style>
</head>
<body>
    <header>
        <h1>우연 투어</h1>
    </header>

    <section>
        <h2>'우연히 만난 우리 인연'</h2>
        <p>우연히 만난 우리 인연을 통해 더욱 특별한 여행을 경험하세요.</p>
    </section>

    <section>
        <h2>어플을 통한 여행 신청</h2>
        <p>우연 투어 어플을 다운로드하고, 신청하면 새로운 인연을 만날 수 있는 기회가 열립니다.</p>
        <a href="#">Android</a>
        <a href="#">IOS</a>
    </section>

    <footer>
        <p>&copy; 2024 우연 투어.</p>
        <p>이메일 : uyeontour@gmail.com</p>
    </footer>
</body>
</html>

    `;
    
    res.send(htmlContent);
});


const pastListRouter = require('./routes/past_list');
const vericode = require('./routes/vericode');
const check_already = require('./routes/check_already');
const vericode2 = require('./routes/vericode2');
const new_list = require('./routes/new_list');
const Assigned = require('./routes/Assigned');
const reset_password = require('./routes/reset_password');
const check_veri= require('./routes/check_veri');
const Register= require('./routes/Register');
const login= require('./routes/login');
const login2= require('./routes/login2');
const submit1= require('./routes/submit1');
const submit2= require('./routes/submit2');
const submit3= require('./routes/submit3');
const past_review= require('./routes/past_review');
const tour_detail= require('./routes/tour_detail');
const past_place_name= require('./routes/past_place_name');
const Add_review= require('./routes/Add_review');
const check= require('./routes/check');
const past_image= require('./routes/past_image');
const new_image= require('./routes/new_image');

app.use('/past_list', pastListRouter);
app.use('/vericode',vericode);
app.use('/check_already', check_already);
app.use('/vericode2', vericode2);
app.use('/new_list', new_list);
app.use('/Assigned', Assigned);
app.use('/reset_password', reset_password);
app.use('/check_veri', check_veri);
app.use('/Register', Register);
app.use('/login', login);
app.use('/login2', login2);
app.use('/submit1', submit1);
app.use('/submit2', submit2);
app.use('/submit3', submit3);
app.use('/past_review', past_review);
app.use('/tour_detail', tour_detail);
app.use('/past_place_name', past_place_name);
app.use('/Add_review', Add_review);
app.use('/check', check);
app.use('/past_image', past_image);
app.use('/new_image', new_image);





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});