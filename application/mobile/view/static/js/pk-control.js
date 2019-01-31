// 保存全局变量
let $action,
    $room_id,
    $user_id,
    $to_user_id,
    $data,
    $userinfo,
    $client_id

// 保存用户登陆信息
$userinfo = {$userinfo};
console.log($userinfo)
localStorage["mUserInfo"] = JSON.stringify($userinfo);
localStorage.setItem("mUserInfo", JSON.stringify($userinfo));
$user_id = $userinfo.user_id;


// 建立websocket链接
var ws = new WebSocket("ws://120.92.10.2:2345");
ws.onopen=function(){
    ws.send("youaremybaby")
    console.log("socket open  链接建立")
}

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



    // TODO
    // 接受邀请 -- 可能不在 omessage 中进行
    $(".agreen").click(function(){
        // TODO
        // 这里的 to_user_id 可能是用户自己的 userid
        window.location.href="../pk/index.html?roomId=" + $room_id + "user_id=" + $user_id; 
    })

    // 被邀请者进入房间
    if($data.action == 'invite') {
        console.log("通知被邀请者进入房间")
        console.log($data)
                
        $(".tanchutn-wrapper").css("display","block")
        document.addEventListener("touchmove",function(e){
            if($(".tanchutn-wrapper").css("display")=='block'){
               $("html,body").addClass("overHiden")
            }else{
               $("html,body").removeClass("overHiden")
            }
        },false)
    }
    
    if($data.action == 'intoroom') {
        console.log("intoroom")
        $(".tanchutn-wrapper").css("display","block")
        document.addEventListener("touchmove",function(e){
            if($(".tanchutn-wrapper").css("display")=='block'){
               $("html,body").addClass("overHiden")
            }else{
               $("html,body").removeClass("overHiden")
            }
        },false)
    }

};

ws.onerror = function () {
    console.log("socket---error")
}

ws.onclose = function() {
    console.log("socket---close")
}


// 渲染列表
$(document).ready(function(){
    $.ajax({
        type: 'POST',
        url: "http://tounao.staraise.com.cn/Api/index/index",
        data: {page:1},
        dataType: "json",
        success: function(res){
          console.log("res")
          console.log(res)
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
            $.ajax({
                type: 'POST',
                url: "http://tounao.staraise.com.cn/Api/pk/invite",
                data: postData,
                dataType: "json",
                success: function (data) {
                    console.log("邀请PK成功")
                    console.log(data)  // 这里可能有room_id 保存到全局  // TODO
                    $room_id = data.room_id;
                },
                error: function () {
                    console.log("邀请PK失败")
                }
            })
            // 发起者进入PK页面
            // window.location.href="../pk/index.html?touserId="+$to_user_id;
        })

          //接受邀请
          $(".agreen").click(function(){
              window.location.href="../pk/index.html?roomId="+$roomid
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

