const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config');

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

function convertTextToHTML(text) {
    // \n을 <br>로 변환
    return text.replace(/\n/g, '<br>');
  } 
  const jinUser = config.email.jin;

router.post('/', (req, res) => {
    console.log('submit3 called')
    const place = req.body.placeName;
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;

    // 1. SELECT 쿼리에서 올바른 조건과 비어 있는 결과 확인을 처리하도록 수정
    connection.query('INSERT INTO applylist (email, name, place, phoneNumber) VALUES (?, ?, ?, ?)', [email, name, place, phoneNumber], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '서버 오류' });
        }
        connection.query('SELECT review FROM tourdetail WHERE place = ? ORDER BY reviewNum asc limit 1', [place], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: '서버 오류' });
            }
            const tex = results[0] ? results[0].review : ''; // 결과가 없을 때를 처리해줍니다.
            const nntex = convertTextToHTML(tex);
            const htmll =`<html><html lang="ko">
            <head>
                <meta charset="UTF-8">

              <style>
                
                .email-container {
                  max-width: 600px;
                  margin: auto;
                  background-color: #f7f7f7;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e3e3e3;
                }
                .email-header {
                  background-color: #004aad;
                  font-family: 'Noto Sans KR', Arial, sans-serif; 
                  color: white;
                  font-size: 10px;
                  padding: 10px;
                  border-radius: 6px 6px 0 0;
                  text-align: center;
                }
                .email-body {
                    padding: 20px;
                    font-family: 'Noto Sans KR', Arial, sans-serif; 
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333333;
                  }
                .email-footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999999;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  background-color: #22b14c;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                }
                .highlight {
                  color: #e55d87;
                  font-weight: bold;
                }
                
              </style>
              <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet">
            </head>
            <body>
                
              <div class="email-container">
                <div class="email-header">
                  <h1>우연 투어에 오신 것을 환영합니다!</h1>
                </div>
                <div class="email-body">
                  <p>투어 신청해주셔서 감사합니다!</p>
                  <p>투어 정보 : </p>
                  <p>${nntex}</p>
                  <div class="button-container" style="text-align: center;">
      <a href="https://open.kakao.com/o/skBu0v4f" class="button">오픈채팅방 문의</a>
    </div>
                  <p>기타 문의사항은 오픈채팅방이나  <span class="highlight">uyeontour@gmail.com</span>으로 연락주세요!</p>
                  <!-- <p>${nntex}</p> -->
                </div>
                <div class="email-footer">
                  <!-- <p></p> -->
                </div>
              </div>
            </body>
            </html>
            
            `
            const mailOptions = {
                from: 'uyeontour@gmail.com',
                to: email,
                subject: `${place} 투어 신청완료 - 우연 투어`,
                html: htmll,
            };
            const mailOptions2 = {
                from: 'uyeontour@gmail.com',
                to: `${jinUser}`,
                subject: `${name}님께서 ${place} 투어를 신청하셨습니다.`,
                text: `${name}님께서 ${place} 투어를 신청하셨습니다.\n${name}님의 전화번호 : ${phoneNumber}`,
            };
            transporter.sendMail(mailOptions2, (error, info) => {
                if(err){
                    console.log(err);
            return res.status(400).json({ error : err });
                }
            })
            transporter.sendMail(mailOptions, (error, info) => {

                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: '이메일 전송 중 오류가 발생했습니다.' });
                }
                console.log('이메일 전송 완료!');
                connection.query('UPDATE new_tour SET People_Real = People_Real + 1 WHERE Name = ?', [place], function(err, results) {
                    if(err){
                        console.log(err);
            return res.status(500).json({ error : err });
                    }
                })
                
            });
            return res.status(200).json({ message: '신청이 완료되었습니다. 자세한 사항은 이메일을 확인해주세요.' });
        });
    });
});

module.exports = router;