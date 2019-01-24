 /*
 * @description: 轮播图
 * @author: Guofeng
 * @update: Guofeng (2019-01-03)
 */
var nowIndex = 0,
    w = $('.poster').width(),   // 7.5rem
    len = $('.item').length,    // 3
    slider_timer = undefined,
    flag = true;
function init_poster() {
    bindEvent();
    slider_auto();
}
init_poster()

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
    $('.poster')
        .mouseenter(function () {
            $('.btn').css({display: 'block'});
            clearTimeout(slider_timer);
        })
        .mouseleave(function () {
            $('.btn').css({display: 'none'});
            clearTimeout(slider_timer);
            slider_auto();
        })
    $('.btn a').mouseover(function () {
        clearTimeout(slider_timer);
        slider_auto();
    })
}
function move(direction) {
    if(flag) {
        flag = false;
        var a = 1;
        if(direction == 'prev' || direction == 'next') {
            if(direction == 'prev'){
                if(nowIndex == 0) {
                    $('.img-box').css({left: -(w * len)});
                    nowIndex = len - 1;
                }else {
                    nowIndex = nowIndex - 1;
                }
            }else {
                if(nowIndex == 2) {
                    a = 0;
                    $('.img-box').animate({left: -(w * len)}, function () {
                        $(this).css({left: 0});
                        clearTimeout(slider_timer);
                        slider_auto();
                        flag = true;
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
            $('.img-box').animate({left: -(w * nowIndex)}, function () {
                clearTimeout(slider_timer);
                slider_auto();
                flag = true;
            });
        }
    }
    
}
function changeOrderStyle(index) {
    $('.activePoster').removeClass('activePoster');
    $('.item').eq(index).addClass('activePoster');
}
function slider_auto() {
    slider_timer = setTimeout(function () {
        move('next');
        changeOrderStyle(nowIndex);
    }, 3000)
}

// init();



// window.onload = function () {
    // var touch = new Touch(document.getElementsByTagName("li"),80).init();
    var touch = new Touch(document.getElementsByClassName("posterItem"),80).init();
        
    //向左滑动触发事件
    touch.swipeLeft = function (dom) {
        // alert(dom.innerText);
        move('next')
        // alert("左")
    };

    //向右滑动事件
    touch.swipeRight = function (dom) {
        // alert(dom.innerText);
        move('prev')
    }
// };

function Touch(dom,range) {
    this.init = function () {
        var that = this;
        for(var i = 0; i<dom.length; i++){
            (function (dom) {
                function touchstart(event) {
                    var e = event || window.event;
                    if(e.targetTouches.length === 1){
                        var startX = e.targetTouches[0].clientX,
                            startY = e.targetTouches[0].clientY;
                        function touchmove(e) {
                            var moveEndX = e.targetTouches[0].clientX,
                                moveEndY = e.targetTouches[0].clientY;
                            if((that.getAngle(startX,startY,moveEndX,moveEndY) >= 135 || that.getAngle(startX,startY,moveEndX,moveEndY) <= -135) && that.getRange(startX,startY,moveEndX,moveEndY) >= range){
                                that.swipeLeft(dom);
                                dom.removeEventListener("touchmove",touchmove);
                            }else if((that.getAngle(startX,startY,moveEndX,moveEndY) >= -45 && that.getAngle(startX,startY,moveEndX,moveEndY) <= 45)&& that.getRange(startX,startY,moveEndX,moveEndY) >= range){
                                that.swipeRight(dom);
                                dom.removeEventListener("touchmove",touchmove);
                            }
                        }

                        function touchend() {
                            dom.removeEventListener("touchend",touchend);
                            dom.removeEventListener("touchmove",touchmove);
                        }

                        dom.addEventListener("touchmove",touchmove);
                        dom.addEventListener("touchend",touchend);
                    }
                }

                dom.addEventListener("touchstart",touchstart);
            })(dom[i]);
        }

        return this;
    };

    //计算滑动的角度
    this.getAngle = function (px1, py1, px2, py2) {
        //两点的x、y值
        x = px2-px1;
        y = py2-py1;
        hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
        //斜边长度
        cos = x/hypotenuse;
        radian = Math.acos(cos);
        //求出弧度
        angle = 180/(Math.PI/radian);
        //用弧度算出角度
        if (y<0) {
            angle = -angle;
        } else if ((y == 0) && (x<0)) {
            angle = 180;
        }
        return angle;
    };

    //计算两点之间的距离
    this.getRange = function (px1,py1,px2,py2) {
        return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
    };

    this.swipeLeft = function (dom) {};

    this.swipeRight = function (dom) {}
}



