// video --- 》 视频播放 js
var video = $(".video")[0],                     // video 组件
    play_btn = $(".video-play-btn")[0],         // 遮罩层
    play_btn_img = $(".video-play-play")[0],    // 播放按钮
    continue_wrap = $(".hint-wrap")[0],         // 蓝色继续播放wrap
    continue_btn = $(".continue")[0],           // video 继续播放按钮
    video_btn = $(".video-btn"),                // 视频选集按钮
    video_btn_wrap = $(".wrap")[0],             // 视频选集 wrap
    number_len = $('.wrap li .video-btn').length; // 选集长度
// ajax 获取 
var lastplay = {
    title : $(".lastplay_title").get(0).value,     // 上次播放的标题
    lesson_id : $(".lesson_id").get(0).value,      // 上次课程id
    lesson_episode_id : $(".lesson_episode_id").get(0).value == "" ? $(".wrap .active span:eq(0)").attr("lesson_episode_id") : $(".lesson_episode_id").get(0).value, // 上次集数id
    number : $(".lastplay_number").get(0).value == "" ? $(".wrap .active span:eq(0)").attr("number") : $(".lastplay_number").get(0).value, // 上次播放集数
    current_time : $(".current_time").get(0).value         // 上次播放时间
}
// ajax 返回数据
var postData = {
    order_id: $(".order_id").get(0).value,  // 
    lesson_id: lastplay.lesson_id,                   // 课程id
    number: lastplay.number,                         // 当前集数
    current_time: lastplay.current_time,             // 当前播放时间
    ended: 0,                                // 是否播放完 0为播放完， 1播放完
    lesson_episode_id:$(".lesson_episode_id").get(0).value == "" ? $(".wrap .active span:eq(0)").attr("lesson_episode_id") : $(".lesson_episode_id").get(0).value // 上次集数id
}
// 初始化函数
function init() {

    
    lastplay.number = localStorage.getItem("lastplay.number")
    lastplay.current_time = localStorage.getItem("lastplay.current_time")
    video.src = $(video_btn).eq(lastplay.number - 1).attr("data-video");
    $(".wrap span").eq(lastplay.number - 1).addClass("btn_active")
    // 判断继续播放是否显示
    if(lastplay.current_time == 0) {
        continue_wrap.style.display = 'none';
    } else {
        continue_wrap.style.display = "flex";
    }
}
init();
// 视频加载
video.onloadeddata = function(){
    video.currentTime = $(".current_time").get(0).value || localStorage.getItem("lastplay.current_time");
    // video.currentTime = localStorage.getItem("lastplay.current_time");
    console.log("lastplay.current_time :"+ lastplay.current_time + ": --> 视频--加载完成")
}
// 开始播放  点击video中按钮
play_btn_img.onclick = function () {
    video.currentTime = $(".current_time").get(0).value || localStorage.getItem("lastplay.current_time");
    video.play();
    play_none();
}
// 开始播放  点击继续播放按钮
video.onloadeddata = function(){
    video.currentTime = $(".current_time").get(0).value || localStorage.getItem("lastplay.current_time");
    continue_btn.onclick = function () {        
        video.play();
        play_none();
    }
}
// 暂停 记录时间
video.onclick = function () {
    video.pause();
    play_block();
    
    // 记录
    lastplay.current_time = postData.current_time = Math.floor(video.currentTime);
    localStorage.setItem("lastplay.current_time", postData.current_time);
    console.log(postData)
    console.log(lastplay)
    // localStorage.setItem("postData.order_id", postData.order_id);                       // 
    // localStorage.setItem("postData.lesson_id", postData.lesson_id);                     // 课程id
    // localStorage.setItem("lastplay.lesson_episode_id", postData.lesson_episode_id);     // 播放集数id
    // localStorage.setItem("lastplay.number", postData.number);                           // 播放的集数
    // localStorage.setItem("lastplay.current_time", postData.current_time);
    // localStorage.setItem("postData.ended", postData.ended);

    $.ajax({
        type: 'POST',
        data: postData,
        url: 'http://jiazheng.staraise.com.cn/mobile/lesson/ajaxPlayedLog',
        success: function () {
            console.log(postData)
        },
        error: function (e) {
            console.log("error -- 暂停");
        }
    })
}


// 视频播放完成 记录时间
video.onended = function() {
    postData.ended = 1;
    postData.current_time = 0;
    
    // 记录
    localStorage.setItem("postData.order_id", postData.order_id);                       // 
    localStorage.setItem("postData.lesson_id", postData.lesson_id);                     // 课程id
    // localStorage.setItem("lastplay.lesson_episode_id", postData.lesson_episode_id);     // 播放集数id
    localStorage.setItem("lastplay.number", postData.number);                           // 播放的集数
    localStorage.setItem("lastplay.current_time", postData.current_time);
    localStorage.setItem("postData.ended", postData.ended);
    
    play_block();
    console.log("视频播放完成"); // 记录播放完成
    
    $.ajax({
        type: 'POST',
        data: postData,
        url: 'http://jiazheng.staraise.com.cn/mobile/lesson/ajaxPlayedLog',
        success: function () {
            console.log(postData)
        },
        error: function (e) {
            console.log("error -- 播放完成");
        }
    })
};
// 监听页面关闭
window.onbeforeunload=function(e){
    var e = window.event||e;
    
    // 记录
    lastplay.current_time = postData.current_time = Math.floor(video.currentTime);
    localStorage.setItem("lastplay.current_time", postData.current_time);
    // localStorage.setItem("lastplay.number", postData.number);                           // 播放的集数
    // localStorage.setItem("postData.order_id", postData.order_id);                       // 
    // localStorage.setItem("postData.lesson_id", postData.lesson_id);                     // 课程id
    // // localStorage.setItem("lastplay.lesson_episode_id", postData.lesson_episode_id);     // 播放集数id
    // localStorage.setItem("postData.ended", postData.ended);

    $.ajax({
        type: 'POST',
        data: postData,
        url: 'http://jiazheng.staraise.com.cn/mobile/lesson/ajaxPlayedLog',
        success: function () {
            console.log(postData)
        },
        error: function (e) {
            console.log("error -- 关闭页面");
        }
    })
}
// 分集，事件代理函数
$(video_btn_wrap).delegate("span","click",function(){
    $(".btn_active").removeClass("btn_active")
    $(this).addClass("btn_active");
    console.log(this)

    continue_wrap.style.display = "none";
    number = $(this).attr("number");
    postData.current_time = 0;
    video.src = $(this).attr("data-video");
    postData.lesson_episode_id = lastplay.lesson_episode_id = $(".lesson_episode_id").get(0).value == "" ? $(".wrap .active span:eq(0)").attr("lesson_episode_id") : $(".lesson_episode_id").get(0).value // 上次集数id
    console.log(postData)
    console.log(lastplay)
    // 记录
    console.log("number : " + number + " --> 第...集")
    console.log(lastplay.number)
    lastplay.number = number;

    // 记录
    localStorage.setItem("postData.order_id", postData.order_id);                       // 
    localStorage.setItem("postData.lesson_id", postData.lesson_id);                     // 课程id
    // localStorage.setItem("lastplay.lesson_episode_id", postData.lesson_episode_id);     // 播放集数id
    localStorage.setItem("lastplay.number", number);                           // 播放的集数
    localStorage.setItem("lastplay.current_time", postData.current_time);
    localStorage.setItem("postData.ended", postData.ended);

    // 加载完成
    video.onloadeddata = function(){
        console.log("lastplay.current_time :"+ lastplay.current_time + ": --> 视频--加载完成")
        video.currentTime = 0;
        // play_block();
        play_none();
        video.play();
    }
});
// 播放按钮 继续播放 wrap 隐藏
function play_none() {
    play_btn.style.display = "none";
    continue_wrap.style.display = "none";
    play_btn_img.style.display = "none";
    continue_btn.style.display = "none";
}
// 播放按钮显示
function play_block() {
    play_btn.style.display = "flex";
    play_btn_img.style.display = "inline-block";
}

// @description: 课程集数选择
var nowIndex = 0,
    w = $('.chapter-part').width(),
    len = $('.item').length,
    slider_timer = undefined,
    flag_poster = true;
bindEvent();
function bindEvent() {
    $('.prevBtn').add($('.nextBtn')).add($('.item')).on('click', function () {
        if($(this).attr('class') == 'prevBtn') {
            move('prev');
        }else if($(this).attr('class') == 'nextBtn') {
            move('next');
        }else {
            var index = $(this).index();
            move(index);
        }
        changeOrderStyle(nowIndex);
    })
    $('.chapter-part')
        .mouseenter(function () {
            $('.btn').css({display: 'block'});
            clearTimeout(slider_timer);
        })
        .mouseleave(function () {
            $('.btn').css({display: 'none'});
            clearTimeout(slider_timer);
        })
    $('.btn a').mouseover(function () {
        clearTimeout(slider_timer);
    })
}
function move(direction) {
    if(flag_poster) {
        flag_poster = false;
        var a = 1;
        if(direction == 'prev' || direction == 'next') {
            if(direction == 'prev'){
                if(nowIndex == 0) {
                    $('.wrap').css({left: -(w * len)});
                    nowIndex = len - 1;
                }else {
                    nowIndex = nowIndex - 1;
                }
            }else {
                if(nowIndex == 2) {
                    a = 0;
                    $('.wrap').animate({left: -(w * len)}, function () {
                        $(this).css({left: 0});
                        clearTimeout(slider_timer);
                        flag_poster = true;
                    })
                    nowIndex = 0;
                }else {
                    nowIndex = nowIndex + 1;
                }
            }
        }else {
            nowIndex = direction;
        }
        if(a) {
            $('.wrap').animate({left: -(w * nowIndex)}, function () {
                clearTimeout(slider_timer);
                flag_poster = true;
            });
        }
    }
}
function changeOrderStyle(index) {
    $('.active').removeClass('active');
    $('.item').eq(index).addClass('active');
}
function slider_auto() {
    slider_timer = setTimeout(function () {
        move('next');
        changeOrderStyle(nowIndex);
    }, 300)
}



