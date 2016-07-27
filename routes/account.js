/**
 * Created by 衡 on 15-5-17.
 */
var express = require('express');
var runtime = require('../runtime');
var sqlexecutor = require('../sqlexecutor');

function push(router) {
    router.get('/account/login', function(req, res) {
        res.render('login', { title: '登录' });
    });

    router.post('/account/loginsvc', function(req, res) {
        runtime.Log("login_key:" + req.param('login_key'), 1);
        var login_key = req.param('login_key');
        var login_pwd = req.param('login_pwd');
        var cpwd = runtime.md5(runtime.md5(login_pwd));
        runtime.Log("login_pwd:" + cpwd, 1);

        sqlexecutor.ExecSql('SELECT *,1 as count FROM user where user_name = @login_key and pwd= @cpwd', {login_key:login_key,cpwd:cpwd}, function(err, rows) {
                if (err) { log(err, 3); }
                if (rows[0] === undefined || rows[0].count == 0) {
                    //res.contentType('application/json');
                    res.send('{"error":“登录失败”}');
                    return;
                }
                else if (rows[0].count > 0) {
                    req.session.isLogin = true;
                    req.session.uname = rows[0].user_name;
                    req.session.uid = rows[0].id;
                    

                    //res.contentType('application/text'); 
                    //res.render('chat');  //只是呈现，客户端的url没有变化
                    res.writeHead(302, { 'Location': '/index' }); //add other headers here...  
                    res.end();
                    return;
                }
            });
    });

    router.get('/account/register', function(req, res) {
        res.render('register', { title: '加入' });
    });
    
    router.post('/account/regsvc', function(req, res) {
        var login_key = req.param('login_key');
        var login_pwd = req.param('login_pwd');
        var cpwd = runtime.md5(runtime.md5(login_pwd));

        res.send({info:"正在注册。。。"});
    });

}

module.exports.push = push;