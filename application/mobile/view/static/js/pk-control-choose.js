var $userinfo = localStorage.getItem(JSON.parse("mUserInfo"));
console.log($userinfo)


function getPageParams() {
    var url = window.location.href
    var option = {}
    if (url.indexOf("?") > -1) {
      var arr = url.split("?")[1].split("&")
      arr.forEach(function (str) {
        var arrTemp = str.split("=")
        option[arrTemp[0]] = arrTemp[1]
        option[arrTemp[1]] = arrTemp[2]
      })
    }
    return option
}

let data=getPageParams()
console.log(data)
var $room_id=data.roomId;
var $to_user_id = data.userId;
var $to_user_id = data.touserID;

$.ajax({
    type: 'POST',
    url: "http://tounao.staraise.com.cn/Api/pk/intoroom",
    data: {to_user_id: $to_user_id,
            room_id: $room_id}, // 发起者id
    dataType: "json",
    success: function (data) {
        console.log("通知发起者开始答题 ---- success");
        console.log(data);

        // $(".user2_poster").prop("src",data.data.touserinfo.head_pic);
        // $(".user2-name").text(data.data.touserinfo.nickname);
        $(".user2_poster").prop("src",data.data.touserinfo.head_pic);
        $(".user2-name").text(data.data.touserinfo.nickname);
    },
    error: function () {
        console.log("通知发起者开始答题 ---- error")
    }
})

console.log(localStorage.getItem("knowledgeList"))
console.log( JSON.parse(localStorage.getItem("knowledgeList")))




$(".begin").click(function () {
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
})


var ws = new WebSocket("ws://120.92.10.2:2345");
ws.onopen=function(){
    ws.send("youaremybaby")
    console.log("socket open  链接建立")
}

// 请求绑定 uid 接口
ws.onmessage = function (event) {
    console.log(event)
    console.log(event.data)
}




























window.onload = function () {
    $(".user1_poster").prop("src",user1_info.poster);
    $(".user1-name").text(user1_info.user_name);
    $(".user2_poster").prop("src",user1_info.duishou.poster);
    $(".user2-name").text(user1_info.duishou.user_name);
}


function init() {
    for(let j = 0; j < 5; j++) {
        (function(j) {
            setTimeout(function() {
                createQuestion(quset_index);
                quset_index++;
                // console.log(quset_index)
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