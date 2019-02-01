// 保存全局变量
let $action,
    $room_id,
    $user_id,
    $to_user_id,
    $data,
    $client_id,
    $knowledgeList = [],
    $user2_answer = '',
    $user2_isright = '',
    $touserinfo = {}

let patentHeight = $(".jindu").height();
let userHeight_1 = 0;
let userHeight_2 = 0;
let $quset_index = 0;
// let timer = 10000;
let timeText = 0;
let $_index = 0;  // 渲染
let $is_choose_2 = false;
let $can_choose  = false;
let $score_1 = 0;
let $score_2 = 0;
let $winer_id = '';
let $sendResult_data = {}


// 保存用户登陆信息
$user_id = $userinfo.user_id;

// 建立websocket链接
var ws = new WebSocket("ws://120.92.10.2:2345");
ws.onopen=function(){
    ws.send("youaremybaby")
    console.log("socket open  链接建立")
}

// 初始化页面
$(".list-wrapper").get(0).style.display = 'block'
$("#load-wrapper").get(0).style.display = 'none';
$("#pk-display").get(0).style.display = 'none';

// 请求绑定 uid 接口
ws.onmessage = function (event) {
    console.log("socket onmessage 接受信息")
    $data = JSON.parse(event.data);
    console.log(event)
    console.log($data)
    $client_id = $data.client_id;
    var postData = {
        user_id: $user_id,
        client_id: $client_id
    }

    // 绑定Uid
    if($data.action == 'client_id') {
        console.log("action **************** client_id")
        $.ajax({
            type: 'POST',
            url: "http://tounao.staraise.com.cn/Api/common/bindUid",
            data: postData,
            dataType: "json",
            success: function(res){
                console.log(res,"socket ajax 绑定成功")
            },
            error: function(e) {
                console.log("socket ajax 绑定失败");
            }
        })
    }

    // 接受者接到通知
    if($data.action == 'invite') {
        console.log("action **************** invite")
        console.log("发起者 action")
        console.log("通知被邀请者进入房间")
        console.log($data)
        $room_id = $data.room_id;
        $(".tanchutn-wrapper").css("display","block")
        document.addEventListener("touchmove",function(e){
            if($(".tanchutn-wrapper").css("display")=='block'){
               $("html,body").addClass("overHiden")
            }else{
               $("html,body").removeClass("overHiden")
            }
        },false)
    }

    
    if($data.action == 'intoRoom') {
        console.log("action **************** intoroom")
        // console.log("接受者 action")
        // console.log($room_id,$user_id)
        // console.log($data)
        // $knowledgeList = $data.knowledgeList;
    }

    // 接受者开始游戏
    if($data.action == 'start') {
        console.log("action **************** start");
        $("#load-wrapper").css("display","none");
        $(".list-wrapper").css("display","none");
        $("#pk-display").css("display","block");
        $(".pk-end-wrapper").css("display","none");
    }


    // 收到对方选择
    if($data.action == 'choose') {
        console.log("action **************** choose")
        $is_choose_2 = true;
        $user2_answer = $data.answer;
        $user2_isright = $data.is_right;
        
        console.log("接收选择答案")
        console.log($is_choose_2)
        console.log( $user2_answer)
        console.log( $user2_isright)

        if($user2_isright == 1) {
            $.each($(".choose-wrapper .choose-btn"),function(index,item) {
                if($(item).attr("data") == $user2_answer) {
                    console.log("user2正确")
                    // $(item).addClass("user2-dui");
                    setTimeout(function() {
                        $(".user2_jindu-con").animate({},function() {
                            userHeight_2 += patentHeight / 5;
                            $(".user2_jindu-con").animate({height:userHeight_2},"fast")
                            $score_2 = Number($("#user2-number").get(0).innerText) + 100;
                            $("#user2-number").text($score_2);
                        })
                    }, 500)
                }
            })
        } else if ($user2_isright == 2){
            $.each($(".choose-wrapper .choose-btn"),function(index,item) {
                if($(item).attr("data") == $user2_answer) {
                    console.log("user2错误")
                    // $(item).addClass("user2-cuo");
                }
            })
        }
    }
    // 结束 --- 胜利者
    if($data.action == 'sendResult') {
        console.log("action **************** sendResult")
        console.log($sendResult_data)
    }


    // 接受邀请 
    $(".agreen").click(function(){    
        $("body").addClass("pk-bg");
        console.log($room_id,$user_id)
        console.log("接受者 agreen")
        $("#load-wrapper").css("display","block");
        $(".list-wrapper").css("display","none");
        $("#pk-display").css("display","none");
        $(".pk-end-wrapper").css("display","none");
        $.ajax({
            type: 'POST',
            url: "http://tounao.staraise.com.cn/Api/pk/intoroom",
            data: {room_id:$room_id,to_user_id:$user_id},
            dataType: "json",
            success: function(data){
                console.log(data)
                console.log("socket ajax 绑定成功")
                $data = data;
                $knowledgeList = data.data.knowledgeList
                $to_user_id = data.data.userinfo.user_id
                $touserinfo = data.data.touserinfo;
                $userinfo = data.data.userinfo;
                createUser();
                gameStart();
                console.log("接受者 agreen*******************************************")
            },
            error: function(e) {
                console.log("接受者 agreen error");
            }
        })       
    })
};

ws.onerror = function () {
    console.log("socket---error")
}

ws.onclose = function() {
    console.log("socket---close")
}




// 点击开始--进入PK
$(".begin").click(function () {
    createUser();
    $("#load-wrapper").css("display","none");
    $(".list-wrapper").css("display","none");
    $("#pk-display").css("display","block");
    $(".pk-end-wrapper").css("display","none");
    
    console.log("发起者---开始游戏")
    $.ajax({
        type: 'POST',
        url: "http://tounao.staraise.com.cn/Api/pk/start",
        data: {to_user_id: $to_user_id}, // 发起者id
        dataType: "json",
        success: function (data) {
            console.log("通知发起者开始答题 ---- success");
            console.log(data);
        },
        error: function () {
            console.log("通知发起者开始答题 ---- error")
        }
    })
    gameStart();
})


// *********************************************************************************



// 渲染列表
$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: "http://tounao.staraise.com.cn/Api/index/index",
        data: {page:1},
        dataType: "json",
        success: function(res){
          res.data.forEach(function(item){
             $("#userList").append(`
                  <li class="item">
                      <div class="left">
                          <div class="number">1</div>
                          <div class="poster">
                              <img src="${item.head_pic}" alt="">
                          </div>
                      </div>
                      <div class="right">
                          <div>
                              <div class="user-name">${item.nickname}</div>
                              <span>北京六小</span>
                          </div>
                          <div>${item.province_city}</div>
                      </div>
                      <div class="pk" data-id="${item.user_id}">PK</div>
                  </li>
              `) 
          })
        
        // 邀请PK
        $(".pk").click(function () {    
            $("body").addClass("pk-bg");
            console.log(this)
            console.log($(this).parents())
            console.log($($(this).parents()).eq(0))
            console.log($($(this).parents()).get(0))

            // var $Li = $($(this).parents()).get(0);
            // console.log($("$Li img").prop("src"))
            // console.log($("$Li img").attr("src"))
            // $touserinfo.nickname = $("$Li .user-name").text();
            // $touserinfo.head_pic = $("$Li img").prop("src")

            createUser();
            $to_user_id = $(this).data("id");
            var postData = {
                user_id : $user_id,
                to_user_id : $to_user_id
            }
            console.log('邀请PK',postData)
            $.ajax({
                type: 'POST',
                url: "http://tounao.staraise.com.cn/Api/pk/invite",
                data: postData,
                dataType: "json",
                success: function (data) {
                    console.log("邀请PK成功")
                    console.log(data)
                    $room_id = data.room_id;              
                    $knowledgeList = data.data.knowledgeList;
                    console.log($knowledgeList)
                },
                error: function () {
                    console.log("邀请PK失败")
                }
            })
            $("#load-wrapper").css("display","block");
            $(".list-wrapper").css("display","none");
            $("#pk-display").css("display","none");
            $(".pk-end-wrapper").css("display","none");
        })

        //   拒绝邀请
          $(".back").click(function(){
              $(".tanchutn-wrapper").hide()
          })
        },
        error: function(e) {
              console.log("被邀请错误 ---- error");
         }
      })
})

// *************************************

// 渲染对战用户信息
function createUser() {
    console.log($userinfo)
    console.log($touserinfo)
    $(".user1-wrapper .poster img").get(0).src = $touserinfo.head_pic;
    $(".user1-wrapper .user1_name").text($touserinfo.nickname)
    $(".user2-wrapper .poster img").get(0).src = $userinfo.head_pic;
    $(".user2-wrapper .user2_name").text($userinfo.nickname)

    $(".user1-title-wrapper img").get(0).src = $userinfo.head_pic;
    $(".user1-title-wrapper .user1-name").text($userinfo.nickname);
    $(".user2-title-wrapper img").get(0).src = $touserinfo.head_pic;
    $(".user2-title-wrapper .user2-name").text($touserinfo.nickname);
}


// *************************************

function gameStart() {
    createQuestion($_index);
    timeFunc();
}


// 设置定时器
function timeFunc () {
    setInterval(function() {
        if(timeText >= 0) {
            if(timeText > 0) {
                timeText--;
            }
            $(".daojishi-content").text(timeText);
        }
    }, 1000)
}

// 渲染题目
function createQuestion(index) {
    // timeText = 10;
    $is_choose_2 = false;
    $can_choose = false;
    let questionsWrapper = '';
    if($_index < 5) {
        remove();
    }
    if(index < 5) {
        questionsWrapper = `<form class="questions-wrapper" action="" data-know_id = ${$knowledgeList[index].room_knowledge_id} data-answer=${$knowledgeList[index].answer}>
                                <h5> ${$knowledgeList[index].title} </h5>
                                <label class="choose-btn" for="a" data="a">
                                    <input type="checkbox" name="" style="display:none"> ${$knowledgeList[index].a}
                                </label>
                                <label class="choose-btn" for="a" data="b">
                                    <input type="checkbox" name="" style="display:none"> ${$knowledgeList[index].b}
                                </label>
                                <label class="choose-btn" for="a" data="c">
                                    <input type="checkbox" name="" style="display:none"> ${$knowledgeList[index].c}
                                </label>
                                <label class="choose-btn" for="a" data="d">
                                    <input type="checkbox" name="" style="display:none"> ${$knowledgeList[index].d}
                                </label>
                            </form>`
        $(".choose-wrapper").html(questionsWrapper);
    }
}



// 选择答案部分
$(".choose-wrapper").delegate(".choose-btn","click", function () {
    
    console.log("$_index", $_index ,"$can_choose",$can_choose)
    var $answer = $(".questions-wrapper").attr("data-answer")
    var _this = $(this);
    console.log($answer)

    // if($(".user1-active").length > 0) { return }
    // if($_index == 5 && timeText == 0) {
    if($(".user1-active").length > 0 || $_index >= 5) { return }
    if($_index < 5) { $(".user1-active").removeClass("user1-active");}
    
    $_index ++;
    console.log("$_index", $_index ,"$can_choose",$can_choose)
    _this.addClass("user1-active")

    if($(this).attr("data") == $answer) {
        console.log("user1 ------- 回答正确！")
        setTimeout(function() {
            _this.addClass("user1-dui");
            $(".user1_jindu-con").animate({},function() {
                userHeight_1 += patentHeight / 5;
                $(".user1_jindu-con").animate({height:userHeight_1},"fast");
                $score_1 = Number($("#user1-number").get(0).innerText) + 100;
                $("#user1-number").text($score_1);
                // $("#user1-number").get(0).innerText = Number($("#user1-number").get(0).innerText) + 100;
            })
        }, 500)
        var postData = {
            room_knowledge_id: $(".questions-wrapper").attr("data-know_id"),
            user_id: $user_id,
            to_user_id: $to_user_id,
            answer:	$(this).attr("data"),
            is_right:1
        }
        console.log(postData)
        $.ajax({
            type: 'POST',
            url: "http://tounao.staraise.com.cn/Api/pk/choose",
            data: postData,
            dataType: "json",
            success: function (data) {
                console.log(data)
                console.log("选择正确 ************* success")
            },
            error: function () {
                console.log("选择正确 *************error")
            }
        })
    } else {
        console.log("回答错误！")
        setTimeout(function() {
            _this.addClass("user1-cuo");
        }, 500)
        $.ajax({
            type: 'POST',
            url: "http://tounao.staraise.com.cn/Api/pk/choose",
            data: {
                room_knowledge_id: $(".questions-wrapper").attr("data-know_id"),
                user_id: $user_id,
                to_user_id: $to_user_id,
                answer:	$(this).attr("data"),
                is_right:2
            },
            dataType: "json",
            success: function (data) {
                console.log(data)
                console.log("选择错误 **************** success")
            },
            error: function () {
                console.log("选择错误 ************* error")
            }
        })
    }
    // 判断user2是否选择完
    let timer = setInterval(function () {
        console.log($is_choose_2)
        if($is_choose_2) {
            $can_choose = true;
            console.log("$_index", $_index ,"$can_choose",$can_choose)
            setTimeout(function () {
                createQuestion($_index);
                if($_index == 5 ) {
                    if($score_1 > $score_2) {
                        $winer_id = $user_id
                        console.log("赢了")
                        $(".pk-end-wrapper .info").text("挑战成功");
                    } else if ($score_1 < $score_2) {
                        $winer_id = $to_user_id
                        console.log("输了")
                        $(".pk-end-wrapper .info").text("挑战失败");
                    } else {
                        console.log("平局")
                        $(".pk-end-wrapper .info").text("平居");
                    }
                    $("#load-wrapper").css("display","none");
                    $(".list-wrapper").css("display","none");
                    $("#pk-display").css("display","none");
                    $(".pk-end-wrapper").css("display","block");
                    $("#score1").text($score_1);
                    $("#score2").text($score_2);
                    console.log($score_1)
                    console.log($score_2)
                    console.log("$winer_id", $winer_id ,"***************************************************************************")
                    alert("结束")
                    $.ajax({
                        type: 'POST',
                        url: "http://tounao.staraise.com.cn/Api/pk/sendResult",
                        data: { room_id :$room_id,
                                winer_id: $winer_id
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data)
                            console.log("结束 **************** success")
                            $sendResult_data = data;
                        },
                        error: function () {
                            console.log("结束 ************* error")
                        }
                    })
                }
            },1500)

            // 对手class显示
            if($user2_isright == 1) {
                $.each($(".choose-wrapper .choose-btn"),function(index,item) {
                    if($(item).attr("data") == $user2_answer) {
                        console.log("user2正确")
                        $(item).addClass("user2-dui");
                    }
                })
            } else if ($user2_isright == 2){
                $.each($(".choose-wrapper .choose-btn"),function(index,item) {
                    if($(item).attr("data") == $user2_answer) {
                        console.log("user2错误")
                        $(item).addClass("user2-cuo");
                    }
                })
            }
            clearInterval(timer);
        }   
    },500)
})

// 选择样式
function remove() {
    $(".user1-active").removeClass("user1-active");
    $(".user1-dui").removeClass("user1-dui");
    $(".user1-cuo").removeClass("user1-cuo");
    $(".user2-dui").removeClass("user2-dui");
    $(".user2-cuo").removeClass("user2-cuo");
}