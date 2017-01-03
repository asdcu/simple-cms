/**
 * Created by asd on 2016/12/24.
 */

var config = require('config-lite');
var Mongolass = require('mongolass');
var Schema = Mongolass.Schema;
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss');
        }
        return result;
    }
});


exports.User = mongolass.model('User', {
    name: {type: 'string'},
    password: {type: 'string'},
    avatar: {type: 'string'},
    admin_role: {type: 'number'},
    admin_name: {type: 'string'},
    login_num: {type: 'number'},
    last_login_time: {type: 'number'}
});

exports.Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId},
    title: {type: 'string'},
    content: {type: 'string'},
    is_belong: {type: 'number'},
    is_show: {type: 'number'},
    created_time: {type: 'number'}
});

exports.User.index({name: 1}, {unique: true}).exec();
