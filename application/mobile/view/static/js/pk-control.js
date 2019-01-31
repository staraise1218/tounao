// 保存全局变量
let $action,
    $room_id,
    $user_id,
    $to_user_id,
    $data,
    $client_id

// 保存用户登陆信息
$user_id = userinfo.user_id;

// 建立websocket链接
var ws = new WebSocket("ws://120.92.10.2:2345");
ws.onopen=function(){
    ws.send("youaremybaby")
    console.log("socket open  链接建立")
}

// 初始化页面
$(".list-wrapper").show();
$("#load-wrapper").hide();
$("#pk-display").hide();



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
        $.ajax({
            type: 'POST',
            url: "http://tounao.staraise.com.cn/Api/common/bindUid",
            data: postData,
            dataType: "json",
            success: function(res){
                console.log("socket ajax 绑定成功")
            },
            error: function(e) {
                console.log("socket ajax 绑定失败");
            }
        })
    }

    // 接受者接到通知
    if($data.action == 'invite') {
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

    // 
    if($data.action == 'intoRoom') {
        console.log("接受者 action")
    }

    // 接受者开始游戏
    if($data.action == 'start') {
        $("#load-wrapper").hide();
        $("#pk-display").show();
        console.log("接收者---开始游戏")
        gameStart();
    }


    // TODO
    // 接受邀请 -- 可能不在 omessage 中进行
    $(".agreen").click(function(){
        console.log($room_id,$user_id)
        // window.location.href="../pk/index.html?roomId=" + $room_id + "&userId=" + $user_id; 
        $(".list-wrapper").hide();
        $("#load-wrapper").show();
    })
};

ws.onerror = function () {
    console.log("socket---error")
}

ws.onclose = function() {
    console.log("socket---close")
}




$.ajax({
    type: 'POST',
    url: "http://tounao.staraise.com.cn/Api/pk/intoroom",
    data: {to_user_id: $to_user_id,
            room_id: $room_id}, // 发起者id
    dataType: "json",
    success: function (data) {
        console.log("通知发起者开始答题 ---- success");
        console.log(data);
    },
    error: function () {
        console.log("通知发起者开始答题 ---- error")
    }
})

console.log(localStorage.getItem("knowledgeList"))
console.log( JSON.parse(localStorage.getItem("knowledgeList")))

// 点击开始--进入PK
$(".begin").click(function () {
    $("#load-wrapper").hide();
    $("#pk-display").show();
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


























// 渲染列表
$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: "http://tounao.staraise.com.cn/Api/index/index",
        data: {page:1},
        dataType: "json",
        success: function(res){
        //   console.log(res)
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
                    console.log(data)  // 这里可能有room_id 保存到全局  // TODO
                    $room_id = data.room_id;
                    localStorage.setItem("knowledgeList",JSON.stringify(data))
                },
                error: function () {
                    console.log("邀请PK失败")
                }
            })
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
            $(".list-wrapper").hide();
            $("#load-wrapper").show();
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

let patentHeight = $(".jindu").height();
let userHeight_1 = 0;
let userHeight_2 = 0;
let quset_index = 0;
let timer = 10000;
let timeText = 0;


function gameStart() {
    for(let j = 0; j < 5; j++) {
        (function(j) {
            setTimeout(function() {
                createQuestion(quset_index);
                quset_index++;
            }, j*timer)
        })(j)
    }
    timeFunc();
}

// 设置定时器
function timeFunc () {
    setInterval(function() {
        if(timeText >= 0) {
            // console.log(timeText)
            if(timeText > 0) {
                timeText--;
            }
            $(".daojishi-content").text(timeText);
        }
        // console.log(localStorage.getItem("user2.answers"))
    }, 1000)
}



function createQuestion(index) {
    timeText = 10;
    let questionsStr = '';
    // user1_info.questions[index].answers[i][1] = 3;
    if(index < 5) {
        questionsStr += `<h5>${user1_info.questions[index].title}</h5>`
        for(var i = 0; i < 4; i++) {
            questionsStr += `<label class="choose-btn" for="a" data="${user1_info.questions[index].answers[i][1]}">
            <input type="checkbox" name="" style="display:none">${user1_info.questions[quset_index].answers[i][0]}
            </label>`
        }
        $(".questions-wrapper").html(questionsStr);
    }
    localStorage.setItem("user1.answers","")
    localStorage.setItem("user2.answers","")
}


// user1
$(".questions-wrapper").delegate(".choose-btn","touchstart", function () {
    var _this = $(this);
    if($(".user1-active").length > 0 || quset_index > 5) {
        return
    }
    if(quset_index == 5 && timeText == 0) {
        return
    }
    if(quset_index < 5) {
        $(".user1-active").removeClass("user1-active");
    }
    _this.addClass("user1-active")
    
    // user2
    // console.log(localStorage.getItem("user2.answers"))
    // if(localStorage.getItem("user2.answers") == 1) {
    //     console.log('user2选择完毕---正确')
    //     setTimeout(function() {
    //         _this.addClass("user2-dui");
    //         $(".user2_jindu-con").animate({},function() {
    //             userHeight_2 += patentHeight / 5;
    //             $(".user2_jindu-con").animate({height:userHeight_2},"fast")
    //             $("#user2-number").get(0).innerText = Number($("#user1-number").get(0).innerText) + 100;
    //         })
    //     }, 500)
    // } else if(localStorage.getItem("user2.answers") == 2) {
    //     console.log("user2----错误")
    // } else {
    //     console.log("user2 未选择")
    // }


    if(localStorage.getItem("user2_choose")!= "") {
        var user2_choose = localStorage.getItem("user2_choose") - 1;
        $(".questions-wrapper .choose-btn").eq(user2_choose)
        console.log($(".questions-wrapper .choose-btn").eq(user2_choose).attr("data")   )
        if($(".questions-wrapper .choose-btn").eq(user2_choose).attr("data") == 1) {
            console.log("user2 --- 正确")
            setTimeout(function() {
                $(".questions-wrapper .choose-btn").eq(user2_choose).addClass("user2-dui");
                $(".user2_jindu-con").animate({},function() {
                    userHeight_2 += patentHeight / 5;
                    $(".user2_jindu-con").animate({height:userHeight_2},"fast")
                    $("#user2-number").get(0).innerText = Number($("#user2-number").get(0).innerText) + 100;
                })
            }, 500)
        } else if($(".questions-wrapper .choose-btn").eq(user2_choose).attr("data") == 2) {
            console.log("user2 --- 错误")
            setTimeout(function() {
                $(".questions-wrapper .choose-btn").eq(user2_choose).addClass("user2-cuo");
            }, 500)
        } else {
            console.log("user2 --- 未选择")
        }
    }

    // user2 end

    if($(this).attr("data") == 1) {
        console.log("回答正确！")
        
        user1_info.answers[quset_index] = 1;        
        localStorage.setItem("user1.answers",user1_info.answers[quset_index])

        setTimeout(function() {
            _this.addClass("user1-dui");
            $(".user1_jindu-con").animate({},function() {
                userHeight_1 += patentHeight / 5;
                $(".user1_jindu-con").animate({height:userHeight_1},"fast")
                $("#user1-number").get(0).innerText = Number($("#user1-number").get(0).innerText) + 100;
            })
        }, 500)
    } else if($(this).attr("data") == 2){
        console.log("回答错误！")

        user1_info.answers[quset_index] = 2;
        localStorage.setItem("user1.answers",user1_info.answers[quset_index])
        console.log(localStorage.getItem("user2.answers"))
        
        setTimeout(function() {
            _this.addClass("user1-cuo");
            // quset_index++;
            // createQuestion(quset_index);
        }, 500)
    } else {
        console.log("已经选择过正确答案")
    }
})

function remove() {
    $(".user1-active").removeClass("user1-active");
    $(".user1-dui").removeClass("user1-dui");
    $(".user1-cuo").removeClass("user1-cuo");
    $(".user2-dui").removeClass("user2-dui");
    $(".user2-cuo").removeClass("user2-cuo");
}