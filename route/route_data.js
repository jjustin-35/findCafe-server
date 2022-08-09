const router = require('express').Router();
const fs = require('fs');

router.get('/address', (req, res) => {
    fs.readFile('../data/taiwan_districts.json', (err, data) => {
        if (err) throw err;
        // 要將buffer轉成物件
        areas = JSON.parse(data);

        res.json(areas);
    })
})

module.exports = router;