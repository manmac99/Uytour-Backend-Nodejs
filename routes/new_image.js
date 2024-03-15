const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


router.post('/', (req, res) => {
    const { length } = req.body;
    const images = [];

    // 이미지 파일의 이름을 1.jpg, 2.jpg, ... 형식으로 가정합니다.
    for (let i = length; i>=1; i--) {
        const imagePath = path.join(__dirname, `../images/New/${i}.jpg`);
        if (fs.existsSync(imagePath)) {
            const imageAsBase64 = fs.readFileSync(imagePath, 'base64');
            images.push(`data:image/jpeg;base64,${imageAsBase64}`);
        } else {
            // 이미지가 없는 경우 에러를 반환하거나 빈 문자열을 넣을 수 있습니다.
            console.log(`Image not found: ${imagePath}`);
            images.push('');
        }
    }

    // 모든 이미지를 base64 인코딩된 문자열의 배열로 클라이언트에 전송합니다.
    res.status(200).json({ images });
});

module.exports = router;