/**
 * Created by asd on 2016/12/31.
 */

//引入markdown解析器
//var marked = require('marked');

var Post = require('../lib/mongo').Post;

var postConfig = {
    'isShow' : ['不显示', '显示'],
    'isBelong' : ['---', '公告', '站内新闻', '行业资讯']
};

//将post的content从markdown转换成html
Post.plugin('changeShowAndBelong', {
    afterFind: function(posts){
        return posts.map(function(post){
            post.is_show = postConfig.isShow[post.is_show];
            post.is_belong = postConfig.isBelong[post.is_belong];
            return post;
        });
    },
    afterFindOne: function (post) {
        if(post){
            post.is_show = postConfig.isShow[post.is_show];
            post.is_belong = postConfig.isBelong[post.is_belong];
        }
        return post;
    }
});

module.exports = {
    //创建一篇文章
    create: function create(post){
        return Post.create(post).exec();
    },

    //通过文章id更新文章
    update: function update(postId, data){
        return Post.update({_id: postId}, {$set: data}).exec();
    },

    //获取当前页所有文章
    getAllPost: function getAllPost(limit, offset) {
        var thisPage = limit * (offset - 1);
        return Post
            .find()
            .sort({'is_show': -1, 'created_time': -1})
            .skip(thisPage)
            .limit(limit)
            .addCreatedAt()
            .changeShowAndBelong()
            .exec();
    },

    //获取所有文章统计
    getAllPostCount: function getAllPostCount(){
        return Post
            .find()
            .exec();
    },

    //通过文章id获取文章内容
    getPostByPostId: function getPostByUserId(postId){
        return Post
            .findOne({'_id': postId})
            .exec();
    }
};

