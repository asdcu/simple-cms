/**
 * Created by asd on 2016/12/22.
 */

var path = require('path');
var express = require('express');
var session = require('express-session');
var routes = require('./routes');
var config = require('config-lite');
var MongoStore = require('connect-mongo')(session);
var app = express();

//设置模板引擎
app.set('view engine', 'ejs');

//设置模板目录
app.set('views', path.join(__dirname, 'views'));

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//session中间件
app.use(session({
    name: config.session.Key, //设置cookie
    secret: config.session.secret, //通过设置secret来计算hash值并放在cookie中，使产生的signedCookie防篡改
    cookie: {
        maxAge: config.session.maxAge //过期时间，过期后cookcie中sessionId自动删除
    },
    store: new MongoStore({ //将session存储在mongodb
        url: config.mongonb //mongodb
    })
}));

//路由
routes(app);

app.listen(3000, function(){
    console.log('node is listenning at port 3000');
});