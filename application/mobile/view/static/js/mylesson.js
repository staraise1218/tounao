
var last_btn_index = "init";
var dataPost = {
    page: "",
}
var canAjax = true;

init()
// 初始化函数
function init() {
    dataPost.page = 1;
    AjaxFunc();
}


function AjaxFunc() {
    $.ajax({
        type: "POST",
        url: "http://jiazheng.staraise.com.cn/index.php/api/user/myLesson",
        data: dataPost,
        success: function (data) {
            if(data.data != 0) {
                createDom(data.data)
                dataPost.page++;
            } else {
                canAjax = false;
            }
        },
        error: function () {
            console.log("error")
        }
    })
}


function createDom(data) {
    var str = '';
    $.each(data, function(){
        str += '<li onclick=window.location="/index.php/mobile/lesson/detail/id/'+this.lesson_id+'">\
                    <div class="poster">\
                        <img src="'+this.thumb+'" alt="poster">\
                    </div>\
                    <div class="right">\
                        <div class="title">'+this.title+'</div>\
                        <div class="price price-symbol ">\
                            ￥<div class="price price-content">'+this.price+'</div>\
                        </div>\
                        <div class="right-pay-wrap">\
                            <div class="time">'+timestampToTime(this.paytime)+'</div>\
                        </div>\
                    </div>\
                </li>'
        
        
    })
    $(".wrapper ul").append(str);
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D;
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
