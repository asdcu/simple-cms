/**
 * Created by asd on 2016/12/24.
 */

var checkLogin = require('../middlewares/check').checkLogin;

module.exports = function (app) {
    app.get('/', checkLogin, function(req, res){
        res.render('index');
    });

    app.use('/system', require('./system'));
    app.use('/content', require('./content'));
    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/user', require('./user'));
};