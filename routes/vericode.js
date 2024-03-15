const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

function generateVerificationCode() {
    // 임의의 4자리 숫자 생성 (1000 ~ 9999)
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    return verificationCode;
}

router.post('/', (req, res) => {
    console.log('Send_vericode');
    const email = req.body.email;
    const veriNum = generateVerificationCode();

    const html = `
    <!DOCTYPE html>
<html>
<head>
    <title>우연 투어 - 회원가입 인증</title>
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

        .verification-code {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .verification-info {
            margin-bottom: 20px;
        }

        .note {
            font-style: italic;
        }
    </style>
</head>
<body>
    <header>
        <h1>우연 투어</h1>
    </header>

    <section>
        <h2>회원가입 인증</h2>
        <p class="verification-info">아래는 회원가입을 위한 인증번호입니다:</p>
        <p class="verification-code">${veriNum}</p>
        <p class="note">* 본 이메일을 요청하지 않았거나, 계정을 만들지 않으려는 경우 이 이메일을 무시해주세요.</p>
    </section>

    <footer>
        <p>&copy; 2024 우연 투어.</p>
        <p>이메일 : uyeontour@gmail.com</p>
    </footer>
</body>
</html>`
const mailOptions = {
    from: 'uyeontour@gmail.com',
    to: email,
    subject: `우연투어 - 인증번호`,
    html: html,
};
connection.query('INSERT INTO temp_user(email, vericode) VALUES (?, ?)', [email, veriNum], function(err, results) {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: error });
        }
        console.log("인증번호 전송됨");

        // 이메일 전송 성공 시 200 상태코드를 클라이언트에게 반환
        return res.status(200).json({ message: "인증번호 전송 성공" });
    });
});
});

module.exports = router;