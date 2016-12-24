/**
 * Created by asd on 2016/12/24.
 */

var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

//GET /logout 登出
router.get('/', checkLogin, function(req, res, next){
    //清空session中用户的信息
    req.session.user = null;
    console.log('退出成功');
    res.redirect('login');
});

module.exports = router;