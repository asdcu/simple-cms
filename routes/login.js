/**
 * Created by asd on 2016/12/24.
 */

var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next){
   res.render('login');
});

module.exports = router;