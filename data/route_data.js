const router = require('express').Router();
const fs = require('fs');

router.get('/address', (res, req, next) => {
    fs.readFile('./data/taiwan_districts.json', (err, data) => {
        if (err) throw err;
        // 要將buffer轉成物件
        areas = JSON.parse(data);

        req.json(areas);
    })
})

module.exports = router;