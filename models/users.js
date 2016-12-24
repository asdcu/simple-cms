/**
 * Created by asd on 2016/12/24.
 */

var User = require('../lib/mongo').User;

module.exports = {
    //通过用户名获取用户信息
    getUserByName: function getUserByName(name){
        return User
            .findOne({name: name})
            .addCreatedAt()
            .exec();
    }
}