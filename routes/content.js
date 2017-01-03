/**
 * Created by asd on 2016/12/24.
 */

var path = require('path');
var express = require('express');

var router = express.Router();
var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;
var pageNum = 10;

//展示文章
router.get('/', checkLogin, function(req, res, next){
    //分页pagination
    var thispage = !!(req.query.page) ? parseInt(req.query.page) : 1;
    var totalPageNum = 0;
    var postNum = 0;
    PostModel.getAllPostCount()
        .then(function (result) {
            postNum = result.length;
        })
        .catch(next);
    PostModel.getAllPost(pageNum, thispage)
        .then(function (result) {
            totalPageNum = Math.ceil(postNum/pageNum);
            res.render('posts/posts', {'allposts': result, 'pagenum': totalPageNum, 'thispage': thispage});
        })
        .catch(next);
});

//创建文章页面
router.get('/create', checkLogin, function(req,res, next){
    res.render('posts/create');
});

//发送创建文章请求
router.post('/create', checkLogin, function (req, res, next) {
    var author = req.session.user._id,
        title = req.body.title,
        content = req.body.editorValue,
        is_belong = parseInt(req.body.is_belong),
        is_show = parseInt(req.body.is_show);
    console.log(req.body);
    res.send(req.body);
    return ;
    //校验参数
    try{
        if(!title.length){
            throw new Error('请填写标题');
        }
        if(content == 'undefined' || !content.length){
            throw new Error('请填写内容');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        is_belong: is_belong,
        is_show: is_show,
        pv: 0,
        created_time: new Date().getTime()
    };

    PostModel.create(post)
        .then(function(result){
            //此post是插入mongodb后的值，包含_id
            post = result.ops[0];
            req.flash('success', '发表文章成功');
            //发表文章成功后跳转到该文章页
            res.redirect('/content');
        })
        .catch(next);
});

//编辑文章展示
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    //通过文章id获取信息
    var postId = req.params.postId;
    PostModel.getPostByPostId(postId)
        .then(function(result){
            res.render('posts/editpost', {"single_post": result});
        })
        .catch(next);

});

router.post('/:postId/edit', checkLogin, function (req, res, next) {
    //通过文章id更新文章
    var postId = req.body.postId,
        title = req.body.title,
        content = req.body.editorValue,
        is_belong = parseInt(req.body.is_belong),
        is_show = parseInt(req.body.is_show);

    //校验参数
    try{
        if(!title.length){
            throw new Error('请填写标题');
        }
        if(content == 'undefined' || !content.length){
            throw new Error('请填写内容');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        title: title,
        content: content,
        is_belong: is_belong,
        is_show: is_show
    };

    //写入数据库
    PostModel.update(postId, post)
        .then(function(){
            //写入flash
            req.flash('success', '修改文章成功');
            res.redirect('/content');
        })
        .catch(function(e){
            req.flash('error', '修改文章失败');
            //返回文章编辑页面
            return res.redirect('/content/:postId/edit');
        });
});

module.exports = router;