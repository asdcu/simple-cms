/**
 * Created by asd on 2016/12/24.
 */

module.exports = {
    checkLogin: function checkLogin(req, res, next){
        if(!req.session.user){
            return res.redirect('/login');
        }
    }
}