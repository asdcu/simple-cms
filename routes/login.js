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

router.post('/', function(req, res, next){
    var name = req.body.name;
    var password = req.body.password;
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
            //登录成功修改管理员信息，登录时间以及登录次数
            var userId = user._id;
            //登录次数加1
            UserModel.incLoginNum(userId);
            //更新登录时间
            UserModel.updateLastLoginTime(userId);
            console.log('登录成功');
            //登录成功，通知前端页面
            req.flash('success', '登录成功');
            //用户信息写入session
            delete user.password;
            user.login_num += 1;

            //转换时间方便用于排序
            user.last_login_time = (function(){
                var now = new Date(user.last_login_time);
                var thisYear = now.getFullYear(),
                    thisMonth = now.getMonth() + 1,
                    thisDay = now.getDate(),
                    thisHour = now.getHours(),
                    thisMinute = now.getMinutes(),
                    thisSecond = now.getSeconds();
                return thisYear + '-' + thisMonth + '-' + thisDay + ' ' + thisHour + ':' + thisMinute + ':' + thisSecond;
            })();
            req.session.user = user;
            res.redirect('/');
        })
        .catch(next);
});

module.exports = router;