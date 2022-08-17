const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/address', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../data/taiwan_districts.json'), (err, data) => {
        if (err) throw err;
        // 要將buffer轉成物件
        areas = JSON.parse(data);

        res.json(areas);
    })
})

module.exports = router;