/**
 * Created by 衡 on 16-08-01.
 */
var express = require('express');
var runtime = require('../runtime');
var sqlexecutor = require('../sqlexecutor');
var url = require('url');

function push(router) {

    //发布活动
    router.post('/activity', function (req, res) {
        var act_theme = req.param('act_theme');
        var act_summary = req.param('act_summary');
        var price = req.param('price');
        var price_desc = req.param('price_desc');
        var act_detail = req.param('act_detail');
        var begin_on = req.param('begin_on');
        var end_on = req.param('end_on');
        var difficuty_flag = req.param('difficuty_flag');
        var start_place = req.param('start_place');

        sqlexecutor.ExecSql(' insert into activity (act_theme,act_summary,price,price_desc,act_detail,begin_on,end_on,' +
            'difficuty_flag,start_place,act_category,banner_url,start_on,leader1_uid) '
            , {
                act_theme: act_theme, act_summary: act_summary, price: price, price_desc: price_desc, act_detail: act_detail, begin_on: begin_on, end_on: end_on,
                difficuty_flag: difficuty_flag, start_place: start_place, act_category: act_category, banner_url: banner_url, start_on: start_on, leader1_uid: leader1_uid
            }
            , function (err, rows) {
                if (err) runtime.Log(err);
                else if (rows.insertId > 0) {
                    res.send({ info: '发布成功' });
                }
                else
                    res.send({ info: '发布失败' });
            });
        return;
    });

    //获取活动未完成的活动 在主页中展示
    router.get('/activity', function (req, res, next) {
        sqlexecutor.ExecSql(' select id,act_theme,act_summary,price,price_desc,begin_on, ' +
            ' end_on,difficuty_flag,difficuty_desc,start_place,act_category,banner_url,start_on,leader1_uid,leader1_name,' +
            ' datediff(end_on,start_on ) days ' +
            ' from activity where isdeleted = 0  ', //--and end_on >= curdate()
            {}, function (err, rows) {
                if (err) runtime.Log(err);
                else if (rows.length > 0) {
                    res.contentType('application/json');
                    res.send({ title: '最近未完成活动', acts: rows });
                    return;
                }
            }
        )
    });


    //获取活动
    router.get('/detail', function (req, res, next) {
        var param = url.parse(req.url, true).query;
        var id = param.aid;

        sqlexecutor.ExecSql(' select id,act_theme,act_summary,price,price_desc,act_detail,begin_on, ' +
            ' end_on,difficuty_flag,difficuty_desc,start_place,act_category,banner_url ,act_category,banner_url,start_on,leader1_uid,leader1_name ,' +
            ' person_count' +
            ' from activity where id = @id ',
            { id: id }, function (err, rows) {
                if (err) runtime.Log(err);
                else if (rows.length > 0) {
                    res.render('detail', { title: '活动详情', act: rows[0] });
                    return;
                }
            }
        )
    });

    //报名页
    router.get('/activity/enroll', function (req, res, next) {
        var param = url.parse(req.url, true).query;
        var user = { act_id: param.aid, user_name: '', pwd: '', real_name: '', gender: '', idcard: '', phone: '', email: '', wechat_no: '', about_me: '', ecperson: '', ecpersonphone: '', others: '' };

        if (req.session.isLogin && req.session.user !== undefined) {
            req.session.act_id = user.act_id;
            user = req.session.user;
        }
        else {
            req.session.user = user;
        }
        res.render('enroll', { title: "报名", user: user });
    });


    //提交报名表单
    router.post('/activity/enroll', function (req, res, next) {
        var param = url.parse(req.url, true).query;
        var user = { act_id: param.aid, user_name: '', pwd: '', real_name: '', gender: '', idcard: '', phone: '', email: '', wechat_no: '', about_me: '', ecperson: '', ecpersonphone: '', others: '' };

        if (req.session.isLogin && req.session.user !== undefined) {
            req.session.act_id = user.act_id;
            user = req.session.user;
        }
        else {
            req.session.user = user;
        }

        user.act_id = param.aid;

        user.user_name = req.param('uname');

        if (user.user_name.length == 0) {
            res.send('昵称不能为空');
            return;
        }

        // if (req.param('upwd' != undefined))
        //     var upwd = runtime.md5(runtime.md5(req.param('upwd')));
        //if (req.param('login_pwd') != undefined && req.param('login_pwd2') != undefined) {
        var login_pwd = req.param('login_pwd');
        var login_pwd2 = req.param('login_pwd2');

        if (login_pwd != login_pwd2) {
            res.send('两次密码输入不一致');
            return;
        }
        if (login_pwd == login_pwd2 && login_pwd == undefined)
            login_pwd = '13';
        user.pwd = runtime.md5(runtime.md5(login_pwd));
        //}

        user.real_name = req.param('ureal_name');
        user.gender = req.param('ugender');
        user.idcard = req.param('uidcard');
        user.phone = req.param('uphone');
        user.email = req.param('uemail');
        user.wechat_no = req.param('uwechat_no');
        user.about_me = req.param('uabout_me');
        user.suggesion = req.param('others');
        user.ecperson = req.param('ecperson');
        user.ecpersonphone = req.param('ecpersonphone');

        var uid = -1;
        if (req.session.uid != undefined && req.session.uid > 0) uid = req.session.uid;

        sqlexecutor.ExecSql(' select * from user where user_name=@uname ', { uname: user.user_name }, function (err, rows) {
            if (err) log(err, 3);
            else if (req.session.isLogin) {
                if (rows.length > 0 && req.session.uname != user.user_name) {
                    res.send({ err: '[' + user.user_name + ']昵称已被使用' });
                    return;
                }
                sqlexecutor.ExecSql(' update user set real_name=@real_name,gender=@gender,idcard=@idcard,phone=@phone  where id = @id ',
                    user, function (err, rows) {
                        if (err) log(err);
                        else if (rows.affectedRows > 0) {
                            req.session.uname = user.user_name;
                            dosign(user, req, res, next);
                        }
                        else {
                            res.send({ err: '报名失败' });
                            return;
                        }
                    });
            }
            else if ((rows.length > 0 && uid < 0)) {
                res.send({ err: '[' + user.user_name + ']昵称已被使用' });
                return;
            }
            else {
                sqlexecutor.ExecSql('insert into user(user_name,pwd,real_name,gender,idcard,phone) ' +
                    'values (@user_name ,@pwd,@real_name,@gender,@idcard,@phone)',
                    user,
                    function (err, rows) {
                        res.contentType('application/json');
                        if (err) { res.send({ err: '报名失败' }); runtime.Log(err, 3); }
                        else if (rows.insertId > 0) {
                            user = rows;

                            req.session.isLogin = true;
                            req.session.uid = rows.insertId;
                            req.session.uname = user.user_name;
                            req.session.user.id = rows.insertId;
                            dosign(req.session.user, req, res, next);
                        }
                    });
            }
        });

    });

    //报名
    function dosign(user, req, res, next) {
        user.is_agreen = 1;
        user.paytype_flag = 0;
        user.signup_on = new Date();
        user.status = 0;
        sqlexecutor.ExecSql(' select * from act_signup where act_id =@act_id and user_id =@user_id',
            { act_id: user.act_id, user_id: user.id }, function (err, rows) {
                if (err) { runtime.Log(err, 3); }
                else if (rows.length > 0) {
                    res.send({ err: '已报名' });
                    return;
                } else {
                    sqlexecutor.ExecSql(' insert into act_signup (act_id,user_id, is_agreen , paytype_flag , status , suggesion , signup_on , ' +
                        ' ecperson , ecpersonphone)  ' +
                        ' values ( @act_id, @id, @is_agreen , @paytype_flag , @status , @suggesion , @signup_on , @ecperson , @ecpersonphone)',
                        user, function (err, rows) {
                            if (err) { runtime.Log(err, 3); }
                            else if (rows.insertId > 0) {
                                res.contentType('application/json');
                                res.send({ info: '报名成功' });
                                return;
                            }
                        });
                }
            });
    }
}



module.exports.push = push;