/**
 * Created by asd on 2016/12/24.
 */

var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var bodyParser = require('body-parser');
//处理上传图片
var multer = require('multer');
var router = express.Router();
//文件上传目录
var upload = multer({dest: path.join(path.resolve('./'), 'public/upload/avatar')});
var checkLogin = require('../middlewares/check').checkLogin;
var UserModel = require('../models/users');
var Tool = require('../lib/tool');
var pageNum = 10;

//所有用户
router.get('/', checkLogin, function(req, res, next){
    //分页paginate
    var thispage = !!(req.query.page) ? parseInt(req.query.page) : 1;
    var totalPageNum = 0;
    var userNum = 0;
    UserModel.getAllUserCount()
        .then(function (result) {
           userNum = result.length;
        })
        .catch(next);
    UserModel.getAllUser(pageNum, thispage)
        .then(function(result) {
            result.forEach(function(single){
                single.last_login_time_nostamp = (!!single.last_login_time) ? Tool.timestampToTime(single.last_login_time) : '0000-00-00 00:00:00';
            });
            //总页数
            totalPageNum = Math.ceil(userNum/pageNum);
            res.render('user/user', {'allusers': result, 'pagenum': totalPageNum, 'thispage': thispage});
            // res.render('user', {'allusers': result});
        })
        .catch(next);
});

//添加用户页面
router.get('/create', checkLogin, function(req, res, next){
   res.render('user/createuser');
});

//添加用户
router.post('/create', checkLogin, upload.single('avatar'), function(req, res, next){
    var name = req.body.name,
        admin_name = req.body.admin_name,
        password = req.body.password,
        repassword = req.body.repassword,
        avatar = req.file.filename;
    //校验参数
    try{
        if(!(name.length >= 1 && name.length <= 10)){
            throw new Error('登录名称请限制在1-10个字符');
        }
        if(!(admin_name.length >=1 && admin_name.length <= 30)){
            throw new Error('账号名称请限制在1-30个字符');
        }
        if(!req.file.fieldname){
            throw new Error('缺少头像');
        }
        if(password.length < 6){
            throw new Error('密码至少6个字符');
        }
    }catch (e){
        //注册失败，异步删除已上传的头像
        fs.unlink(req.file.path);
        req.flash('error', e.message);
        return res.redirect('/user/create');
    }

    //明文密码加密
    password = sha1(password);

    //待写入数据库的用户信息
    var user = {
        name: name,
        admin_name: admin_name,
        password: password,
        avatar: avatar,
        admin_role: 1,
        login_num: 0
    };

    //信息写入数据库
    UserModel.create(user)
        .then(function(result){
            //此user是插入mongodb后的值,包含_id
            user = result.ops[0];
            //写入flash
            req.flash('success', '添加管理员成功');
            //跳转到管理员列表首页
            res.redirect('/user');
        })
        .catch(function(e){
            //写入数据库失败，异步删除上传的头像
            fs.unlink(req.file.path);
            //用户名被占用则调回添加用户注册页，而不跳转错误页
            if(e.message.match('E11000 duplicate key')){
                req.flash('error', '用户名已被占用');
                return res.redirect('/user/create');
            }
            next(e);
        })

});

//编辑用户展示
router.get('/:name/edit', checkLogin, function(req, res, next){
    //通过用户名获取信息
    var name = req.params.name;
    UserModel.getUserByName(name)
        .then(function (result) {
            res.render("user/edituser", { "single_user": result});
        })
        .catch(next);
});

//编辑用户
router.post('/:name/edit', checkLogin, upload.single('avatar'), function (req, res, next) {
    //通过用户id修改用户信息
    var name = req.body.name,
        admin_name = req.body.admin_name,
        password = req.body.password,
        repassword = req.body.repassword,
        userId = req.body.userId;


    //校验参数
    try{
        if(!(name.length >= 1 && name.length <= 10)){
            throw new Error('登录名称请限制在1-10个字符');
        }
        if(!(admin_name.length >=1 && admin_name.length <= 30)){
            throw new Error('账号名称请限制在1-30个字符');
        }
        if(password.length < 6){
            throw new Error('密码至少6个字符');
        }
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('/user/:name/edit');
    }

    //明文密码加密
    password = sha1(password);

    //待写入数据库的用户信息
    var user = {
        name: name,
        admin_name: admin_name,
        password: password
    };
    //信息写入数据库
    UserModel.update(userId, user)
        .then(function(result){
            //写入flash
            req.flash('success', '修改成员信息成功');
            //跳转到管理员列表首页
            res.redirect('/user');
        })
        .catch(function(e){
            //用户名被占用则调回添加用户注册页，而不跳转错误页
            if(e.message.match('E11000 duplicate key')){
                req.flash('error', '用户名已被占用');
                return res.redirect('/user/:name/edit');
            }
            next(e);
        })


});

//删除用户
router.get('/:userId/remove', checkLogin, function (req, res, next) {
    var userId = req.params.userId;
    if(!!!userId){
        req.flash('error', '删除管理员失败');
        res.redirect('/user');
    }
    UserModel.removeUserByUserId(userId)
        .then(function(){
            //写入flash
            req.flash('success', '删除理员成功');
            //跳转到管理员列表首页
            res.redirect('/user');
        })
        .catch(next);
});

module.exports = router;