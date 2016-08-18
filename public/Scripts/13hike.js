/*
|------------------------------------------|
| @author:  衡
|------------------------------------------|
|AlterHistory:
|2016-08-7	create
*/

HIKE = {
    version: '1.0',     // 全局静态对象
    isReady: false,     //文档是否加载完成标志
    is_mobile: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    },
    funcs: [],          // 缓存函数的数组
    onReady: function (f) {
        if (HIKE.isReady) f();
        else HIKE.funcs.push(f);
    },
    run: function () {
        if (HIKE.isReady)
            return;
        for (var i = 0; i < HIKE.funcs.length; i++) {
            try {
                var f = HIKE.funcs[i];
                f();
            } catch (e) {
                alert("[function " + f.name + "() ] 发生异常 " + e);
            }
        }
        HIKE.isReady = true;
        funcs = []; // 清空一下
    }
}

if (window.addEventListener) {
    // 标准的 DOM2 事件注册方式
    window.addEventListener("load", HIKE.run, false);
} else if (window.attachEvent) {
    //IE 的事件注册方式
    window.attachEvent("onload", HIKE.run);
} else {
    // 原始的0级 DOM 的事件注册方式
    window.onload = HIKE.run;
}


var scripts = {
    // 'baidu_stat': '//hm.baidu.com/hm.js?7b75b0a60e7eee892a399711f7358a01',
    //'top':'http://l.tbcdn.cn/apps/top/x/sdk.js?appkey=21792936'
}

var images = {
    'orderedList0': '../images/orderedList0.png',
    'orderedList1': '../images/orderedList1.png',
    'orderedList2': '../images/orderedList2.png',
    'orderedList3': '../images/orderedList3.png',
    'orderedList4': '../images/orderedList4.png',
    'orderedList5': '../images/orderedList5.png',
    'orderedList6': '../images/orderedList6.png',
    'orderedList7': '../images/orderedList7.png',
    'orderedList8': '../images/orderedList8.png',
    'orderedList9': '../images/orderedList9.png'
};

HIKE.onReady(
    function pre_load() {
        if ("undefined" !== typeof (Royal_Preloader)) {
            Royal_Preloader.config({
                scripts: scripts,
                images: images,
                mode: 'text',
                text: 'welcome 13hike - loding...',
                background: ['#000']   //#2bc9fd
            });

            Royal_Preloader.onLoadFinish = (function () {
                if (window.is_loaded) return;
                window.is_loaded = true;
            });

            if ("undefined" !== typeof (jQuery)) {
                $(document).ready(function () {
                    Royal_Preloader._init();
                });
            }
        }
    }
);

//加载活动
HIKE.onReady(
    function load_acts() {
        jQuery.getJSON(window.location.origin + "/activity/", 'p=11',
            function (data, textStatu, jqXHR) {
                $("#ul_acts > li").each(function (i, e) {
                    $(e).remove();
                });

                $.each(data.acts, function (j, d) {
                    var row = document.createElement("li");
                    row.id = "li_" + d["id"]; row.className = "aui-list-item";
                    var rowContentHtml = " <a href=\"/detail?aid=" + d["id"] + " \" class=\"aui-media-list-item-inner\">";
                    var rowContentHtml = rowContentHtml + " <div class=\"aui-list-item-media\"> <img src=\" " + d["banner_url"] + " \"> </div>";
                    var rowContentHtml = rowContentHtml + "  <div class=\"aui-list-item-inner\">  <div class=\"aui-list-item-text\"> ";
                    var rowContentHtml = rowContentHtml + "  <div class=\"aui-list-item-title\"> " + d["act_theme"] + " </div>";
                    var rowContentHtml = rowContentHtml + "  <div class=\"aui-list-item-right\">" + d["days"] + "天线</div>";
                    var rowContentHtml = rowContentHtml + "  </div>";
                    var rowContentHtml = rowContentHtml + "  <div class=\"aui-list-item-text\"> " + d["act_summary"] + " </div>";
                    var rowContentHtml = rowContentHtml + "  </div> </a>";


                    var rowContentHtml = rowContentHtml + "  <div class=\"aui-info\" style=\"padding-top:0\">";
                    var rowContentHtml = rowContentHtml + " <div class=\"aui-info-item\">  ";
                    var rowContentHtml = rowContentHtml + "     <span class=\"aui-margin-l-5\">领队:" + d["leader1_name"] + "</span>";
                    var rowContentHtml = rowContentHtml + "  </div>";
                    var rowContentHtml = rowContentHtml + "   <div class=\"aui-info-item\"> "+ d["start_on"]+" 出发</div>";
                    var rowContentHtml = rowContentHtml + "  </div>";

                    row.innerHTML = rowContentHtml;
                    $("#ul_acts")[0].appendChild(row);
                }
                );
            });
    }
);