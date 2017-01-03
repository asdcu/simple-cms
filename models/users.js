/**
 * Created by asd on 2016/12/24.
 */

var User = require('../lib/mongo').User;

module.exports = {

    //添加一个用户
    create: function create(user) {
        return User.create(user).exec();
    },

    //更新用户信息
    update: function update(userId, data){
        return User.update({_id: userId}, {$set: data}).exec();
    },

    //获取当前页所有用户
    getAllUser: function getAllUser(limit,offset){
        var thisPage = limit * (offset -1);
        console.log(thisPage);
        return User
            .find()
            .skip(thisPage)
            .limit(limit)
            .exec();
    },

    //删除用户
    removeUserByUserId: function removeUserByUserId(userId){
        return User
            .remove({_id: userId})
            .exec();
    },

    //获取所有用户用于统计
    getAllUserCount: function getAllUserCount(){
        return User
            .find()
            .exec();
    },


    //通过用户名获取用户信息
    getUserByName: function getUserByName(name){
        return User
            .findOne({name: name})
            .exec();
    },

    //通过用户id获取用户信息
    getUserByUserId: function getUserByUserId(userId) {
        return User
            .findOne({_id: userId})
            .exec()
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