/**
 * Created by asd on 2016/12/24.
 */


module.exports = {
    port: 3000,
    session: {
        secret: 'jiuyuan',
        key: 'jiuyuan',
        maxAge: 2592000000
    },
    //mongodb地址
    mongodb: 'mongodb://127.0.0.1:27017/jiuyuan'
};