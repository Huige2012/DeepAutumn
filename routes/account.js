/**
 * Created by 衡 on 15-5-17.
 */
var express = require('express');
var runtime = require('../runtime');
var sqlexecutor = require('../sqlexecutor');
var url = require('url');

function push(router) {

    router.get('/complete', function (req, res) {
        //var param = url.parse(req.url, true).query;
        var data = { user_name: '', pwd: '', real_name: '', gender: '', idcard: '', phone: '', email: '', wechat_no: '', about_me: '' };

        if (req.session.uid != undefined && req.session.uid > 0) {
            sqlexecutor.ExecSql('select * from user where id=@uid', { uid: req.session.uid },
                function (err, rows) {
                    if (err) log(err, 3);
                    else if (rows.length > 0) {
                        res.render('enroll', { title: '修改个人信息', user: rows[0] });
                        return;
                    }
                    else
                        res.render('enroll', { title: '加入', user: data });
                }
            );
        }
        else
            res.render('enroll', { title: '加入', user: data });
    });


    router.get('/account/login', function (req, res) {
        res.render('login', { title: '登录' });
    });


    router.post('/account/loginsvc', function (req, res) {
        runtime.Log("login_key:" + req.param('login_key'), 1);
        var login_key = req.param('login_key');
        var login_pwd = req.param('login_pwd');
        var cpwd = runtime.md5(runtime.md5(login_pwd));
        runtime.Log("login_pwd:" + cpwd, 1);

        sqlexecutor.ExecSql('SELECT *,1 as count FROM user where ( user_name = @login_key or email= @login_key1 or phone= @login_key2 ) and pwd= @cpwd', { login_key: login_key, login_key1: login_key, login_key2: login_key, cpwd: cpwd },
            function (err, rows) {
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
                    req.session.user = rows[0];
                    delete req.session.user.pwd;

                    //res.contentType('application/text'); 
                    //res.render('chat');  //只是呈现，客户端的url没有变化
                    res.writeHead(302, { 'Location': '/profile' }); //add other headers here...  
                    res.end();
                    return;
                }
            });
    });

    //进入用户信息页面
    router.get('/account/register', function (req, res) {
        //var param = url.parse(req.url, true).query;
        var data = { user_name: '', pwd: '', real_name: '', gender: '', idcard: '', phone: '', email: '', wechat_no: '', about_me: '' };

        if (req.session.uid != undefined && req.session.uid > 0) {
            sqlexecutor.ExecSql('select * from user where id=@uid', { uid: req.session.uid },
                function (err, rows) {
                    if (err) log(err, 3);
                    else if (rows.length > 0) {
                        res.render('register', { title: '修改个人信息', user: rows[0] });
                        return;
                    }
                    else
                        res.render('register', { title: '加入', user: data });
                }
            );
        }
        else
            res.render('register', { title: '加入', user: data });
    });

    //保存用户信息
    router.post('/account/register', function (req, res) {
        var uname = req.param('uname');

        if (uname.trim().length == 0) {
            res.send('昵称不能为空');
            return;
        }

        // if (req.param('upwd' != undefined))
        //     var upwd = runtime.md5(runtime.md5(req.param('upwd')));
        var upwd = '';
        if (req.param('login_pwd') != undefined && req.param('login_pwd2') != undefined) {
            var login_pwd = req.param('login_pwd');
            var login_pwd2 = req.param('login_pwd2');

            if (login_pwd != login_pwd2) {
                res.send('两次密码输入不一致');
                return;
            }

            upwd = runtime.md5(runtime.md5(login_pwd));
        }

        var ureal_name = req.param('ureal_name');
        var ugender = req.param('ugender');
        var uidcard = req.param('uidcard');
        var uphone = req.param('uphone');
        var uemail = req.param('uemail');
        var uwechat_no = req.param('uwechat_no');
        var uabout_me = req.param('uabout_me');
        var uid = -1;
        if (req.session.uid != undefined && req.session.uid > 0) uid = req.session.uid;

        sqlexecutor.ExecSql(' select 1 from user where user_name=@uname ', { uname: uname }, function (err, rows) {
            if (err) log(err, 3);
            else if ((rows.length > 0 && uid < 0) || (rows.length > 0 && req.session.isLogin && req.session.uname != uname)) {
                res.send('[' + uname + ']用户名已被使用');
                return;
            }
            else { //用户名可用
                if (req.session.uid != undefined && req.session.uid > 0) {
                    sqlexecutor.ExecSql(' update user set  user_name=@uname,real_name=@ureal_name,gender=@ugender,idcard=@uidcard,phone=@uphone,email=@uemail,wechat_no=@uwechat_no,about_me=@uabout_me  where id = @id ',
                        { id: req.session.uid, uname: uname, upwd: upwd, ureal_name: ureal_name, ugender: ugender, uidcard: uidcard, uphone: uphone, uemail: uemail, uwechat_no: uwechat_no, uabout_me: uabout_me }, function (err, rows) {
                            if (err) log(err);
                            else if (rows.affectedRows > 0) {
                                req.session.uname = uname;
                                // res.render('register', {
                                //     title: '修改个人信息',
                                //     user: { user_name: uname, pwd: upwd, real_name: ureal_name, gender: ugender, idcard: uidcard, phone: uphone, email: uemail, wechat_no: uwechat_no, about_me: uabout_me }
                                // });
                                res.writeHead(302, { 'Location': '/profile' }); //add other headers here... });
                                res.end();
                                return;
                            }
                            else {
                                res.send('保存个人信息失败');
                                return;
                            }
                        });
                }
                else {
                    sqlexecutor.ExecSql('insert into user(user_name,pwd,real_name,gender,idcard,phone,email,wechat_no,about_me) ' +
                        'values (@uname ,@upwd,@ureal_name,@ugender,@uidcard,@uphone,@uemail,@uwechat_no,@uabout_me)',
                        { uname: uname, upwd: upwd, ureal_name: ureal_name, ugender: ugender, uidcard: uidcard, uphone: uphone, uemail: uemail, uwechat_no: uwechat_no, uabout_me: uabout_me },
                        function (err, rows) {
                            res.contentType('application/json');
                            if (err) { res.send({ err: '注册失败' }); runtime.Log(err, 3); }
                            else if (rows.insertId > 0) {
                                data = rows;

                                req.session.isLogin = true;
                                req.session.uid = rows.insertId;
                                req.session.uname = uname;

                                res.writeHead(302, { 'Location': '/account/login' }); //add other headers here... });
                                res.end();
                                return;
                            }
                        });

                }
            }
        });
    });

    //进入设置密码页
    router.get('/account/setpwd', function (req, res) {
        if (!req.session.isLogin) {
            res.writeHead(302, { 'Location': '/account/login' }); //add other headers here... });
            res.end();
            return;
        }
        res.render('setpwd', { title: '设置密码', uid: req.session.uid, uname: req.session.uname });
    });

    router.post('/account/setpwd', function (req, res) {
        if (!req.session.isLogin) {
            res.writeHead(302, { 'Location': '/account/login' }); //add other headers here... });
            res.end();
            return;
        }

        var login_pwd = req.param('login_pwd');
        var login_pwd2 = req.param('login_pwd2');

        if (login_pwd != login_pwd2) {
            res.send('两次密码输入不一致');
            return;
        }

        var cpwd = runtime.md5(runtime.md5(login_pwd));
        var cpwd2 = runtime.md5(runtime.md5(login_pwd2));

        sqlexecutor.ExecSql(' update user set pwd = @pwd  where id = @id ', { pwd: cpwd, id: req.session.uid }, function (err, rows) {
            if (err) log(err);
            else if (rows.affectedRows > 0) {
                res.writeHead(302, { 'Location': '/account/login' });
                res.end();
                return;
            }
            else {
                res.send('设置密码失败');
                return;
            }
        });
    });

    //退出登录
    router.get('/account/signout', function (req, res) {
        req.session.destroy();
        res.writeHead(302, { 'Location': '/account/login' });
        res.end();
        return;
    });
}

module.exports.push = push;