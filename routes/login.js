/**
 * Created by asd on 2016/12/24.
 */

var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');
var sha1 = require('sha1');

router.get('/', checkNotLogin, function(req, res, next){
   res.render('login');
});

router.post('/', checkNotLogin, function(req, res, next){
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name)
        .then(function(user){
            if(!user){
                console.log('用户不存在');
                return res.redirect('/login');
            }

            //检查密码是否匹配
            if(sha1(password) !== user.password){
                console.log('用户名或密码错误');
                return res.redirect('/login');
            }
            console.log('登录成功');
            //用户信息写入session
            delete user.password;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(next);
})

module.exports = router;