--活动表
drop TABLE if exists activity;

CREATE TABLE if not exists activity (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  act_theme varchar(200) DEFAULT NULL,     --活动主题
  act_summary varchar(500) DEFAULT NULL,   --活动摘要
  price double(18,2) null,                 --活动费用
  price_desc varchar(200),                 --活动费用描述
  act_detail longtext null,                    --活动详情
  begin_on datetime null,                  --开始时间
  end_on datetime null,                    --结束时间
  difficuty_flag  smallint null,           --难度指数
  difficuty_desc  varchar(500) null,       --难度描述
  start_place varchar(200) null,           --集合地点
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;


DROP PROCEDURE IF EXISTS  `coredb`.`alter_activity`; 
CREATE PROCEDURE `coredb`.`alter_activity` (IN icount int) 
 COMMENT '修改活动表' 
 DETERMINISTIC 
 READS SQL DATA 
  SQL SECURITY DEFINER 
begin
    --活动分类
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='act_category';
    if @i=0 then alter table activity add act_category varchar(100) null; end if;
    
    --活动banner_url
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='banner_url';
    if @i=0 then alter table activity add banner_url varchar(100) null; end if;
    
    --出发时间  
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='start_on';
    if @i=0 then alter table activity add start_on datetime null; end if;
    
    --领队 leader1_uid
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='leader1_uid';
    if @i=0 then alter table activity add leader1_uid varchar(100) null; end if;

     --领队名 leader1_name
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='leader1_name';
    if @i=0 then alter table activity add leader1_name varchar(100) null; end if;
    
    --多少人成行 person_count
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='person_count';
    if @i=0 then alter table activity add person_count int null; end if;
    
    --活动创建时间
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='create_on';
    if @i=0 then alter table activity add create_on datetime null; end if;

    --活动创建人
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='create_by_uid';
    if @i=0 then alter table activity add create_by_uid int null; end if;

    --浏览次数 
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='read_count';
    if @i=0 then alter table activity add read_count int null; end if;

    --删除状态
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='isdeleted';
    if @i=0 then alter table activity add isdeleted smallint default 0; end if;

    --版本号
    select  @i:=count(column_name)  from information_schema.columns where
        table_name='activity' and column_name='rowversion';
    if @i=0 then alter table activity add rowversion datetime default now(); end if;

end; 

call alter_activity(1);

insert into activity (act_theme,act_summary, leader1_name) values('【二期】来自大美青海的一封情书', '油菜花盛开季
32号带领大家圆梦青海，重走丝绸之路
梦再远，我们一起追；
路再难，我们陪你走。','zyy');

insert into activity (act_theme,act_summary, leader1_name) values('【年保玉则】溜进天神的后花园', '七月的草原是一个新娘
连绵的野花织成了最美的五彩嫁纱。
湖是倒过来的天，鱼是会飞的云。
雪山圣湖旁，
听花开的声音。','zyy');

select * from activity;




--活动报名表
drop TABLE if exists act_signup;

CREATE TABLE if not exists act_signup (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  act_id bigint(20) NULL,               --报名活动ID 
  user_id bigint(20) NULL,              --报名用户ID
  is_agreen smallint not null DEFAULT 1,--是否同意免责声明
  paytype_flag smallint null,           --支付方式
  status smallint not null default 0,   --状态  0：未支付  1:已支付
  suggesion varchar(200),               --对此活动的意见
  order_id varchar(50) null,            --订单ID
  signup_on datetime null ,      	    --报名时间
  ecperson varchar(50) null,            --紧急联系人
  ecpersonphone varchar(20) null,       --紧急联系人电话
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

insert into act_signup (act_id,user_id,suggesion) values(1,1,'玩的愉快');
insert into act_signup (act_id,user_id,suggesion) values(2,2,'玩的愉快2');

select * from act_signup;

