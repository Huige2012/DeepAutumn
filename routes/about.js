/**
 * Created by 衡 on 15-5-17.
 */
var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res) {
    res.render('about', { title: 'Express' });
});
router.post('/', function(req, res) {
    res.render('about', { title: 'Express' });
});
module.exports = router;