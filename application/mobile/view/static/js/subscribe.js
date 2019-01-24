var oUl = $(".wrapper ul").get(0);
var asdf = '';
var last_btn_index = "init";
var dataPost = {
    page: "",
    cat_id: 0
}
var canAjax = true;

init()
// 初始化函数
function init() {
    // dataPost.cat_id = $(".nav-wrap ul li:eq(0) a").attr("cat_id");
    dataPost.page = 1;
    // console.log(dataPost.cat_id)
    // console.log("初始化 dataPost.page : " + dataPost.cat_id);
    AjaxFunc();
}
// 点击导航切换 id
$(".nav-wrap").delegate("a", "click", function (e) {
    console.log("-------------------------------------------")
    var index = $(".item_nav").index($(this));
    console.log("cat_id :"  + $(this).attr("cat_id"));
    console.log("index :" + index);
    console.log("last_btn_index :" + last_btn_index);
    if(last_btn_index != index) {
        console.log("刷新页面")
        canAjax = true;
        last_btn_index = index;
        oUl.innerHTML = "";
        dataPost.cat_id = $(this).attr("cat_id");
        dataPost.page = 1;
        AjaxFunc();
        console.log("last_btn_index :" + last_btn_index);
    }
    console.log("============================================");
})

function AjaxFunc() {
    $.ajax({
        type: "POST",
        url: "http://jiazheng.staraise.com.cn/index.php/api/aunt/getlist",
        data: dataPost,
        success: function (data) {
            if(data.data != 0) {
                createDom(data.data)
                console.log(data)
                console.log("ajax 数据获取成功")
                dataPost.page++;
            } else {
                console.log("ajax 没有更多数据");
                canAjax = false;
            }
        },
        error: function () {
            console.log("error")
        }
    })
}


function createDom(data) {
    for (var i = 0; i < data.length; i++) {
        var str = '',
            tagStr = '',
            oLi = document.createElement("li"),
            tagArr = data[i].tag;
        for(var j = 0; j < tagArr.length; j++) {
            tagStr += '<span>'+ tagArr[j] +'</span>'
        }
        str += 
            '<div class="poster">\
                <img src="'+ data[i].thumb + '" alt="poster">\
            </div>\
            <div class="right">\
                <div class="title">\
                    <strong style="margin-right:0.2rem">'+ data[i].title + '</strong>\
                    <span>'+ data[i].leixing + '</span>\
                </div>\
                <div class="price price-symbol" style="color:#8B8B8B">\
                    '+ data[i].description+'\
                </div>\
                <div class="skill">\
                '+ tagStr +'\
                </div>\
                <div class="right-pay-wrap">\
                    <div class="pay">\
                        <a href="tel:13666666666" class="pay-btn">联系家政经纪人</a>\
                    </div>\
                </div>\
            </div>\
            <a id="link-bg" href="'+ data[i].url +'" class="click_link"></a>'
        oLi.innerHTML = str;
        oUl.appendChild(oLi);
    }
}




// 获取滚动条当前的位置 
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

//获取当前可视范围的高度 
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}

//获取文档完整的高度 
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

//滚动事件触发
window.onscroll = function () {
    if(canAjax) {
        if (getScrollTop() + getClientHeight() == getScrollHeight()) {
            console.log(dataPost)
            AjaxFunc()
        }
    }
}
// if(getScrollTop() == 0) {
//     AjaxFunc()
// }
