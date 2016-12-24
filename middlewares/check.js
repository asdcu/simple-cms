/**
 * Created by asd on 2016/12/24.
 */

module.exports = {
    checkLogin: function checkLogin(req, res, next){
        //未登录，直接重定向至登录页面
        if(!req.session.user){
            return res.redirect('/login');
        }
    },
    checkNotLogin: function checkNotLogin(req, res, next){
        //已登录，跳过登录步骤
        if(req.session.user){
          res.render('/');
        }
    },
}