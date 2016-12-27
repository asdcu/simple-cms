/**
 * Created by asd on 2016/12/24.
 */

var User = require('../lib/mongo').User;

module.exports = {

    //添加一个用户
    create: function create(user) {
        return User.create(user).exec();
    },

    //通过用户名获取用户信息
    getUserByName: function getUserByName(name){
        return User
            .findOne({name: name})
            .addCreatedAt()
            .exec();
    },

    //通过管理员id给login_num加1
    incLoginNum: function(userId){
        return User
            .update({_id: userId}, {$inc: {login_num: 1}})
            .exec();
    },

    //通过管理员id更新最近登录时间
    updateLastLoginTime: function (userId) {
        var now = new Date().getTime();
        return User
            .update({_id: userId}, {$set: {last_login_time: now}})
            .exec();
    }
};