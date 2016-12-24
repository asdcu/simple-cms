/**
 * Created by asd on 2016/12/24.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('content');
});

module.exports = router;