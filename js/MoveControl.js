/**
 * Created by ajex on 2018/3/14.
 * 边拖边走类
 */
//MoveControl
var cls = cls||{};
(function() {
    function MoveControl(touchObj,target,length,type,speed)//touch对象和移动对象分开，用来做 touch时可以挪动多个不同速度对象的特效
    {
        var _this = this;
        this.touchObj = touchObj;
        this.target = target;
        this.length = length;
        this.type = type;
        this.speed = speed;

        var isMouseDown = false;
        var mx = 0;
        var my = 0;
        var cx = 0;
        var cy = 0;
        var ax =0;//现在的鼠标坐标 和mx的区别是 mx是鼠标按下时记录的 ax是实时更新的
        var ay = 0;
        var timestamp;
        var intervalNo;
        touchObj.addEventListener('mousedown',function(mouseEvent){
            isMouseDown = true;
            if(tweenObj) createjs.Tween.removeTweens(_this);
            _w = 0;
            _h = 0;
            cx = target.x;
            cy = target.y;
            mx = mouseEvent.rawX;
            my = mouseEvent.rawY;
            ax = mouseEvent.rawX;
            ay = mouseEvent.rawY;
//            clearInterval(intervalNo);
//            intervalNo = setInterval(function (){
//                timestamp  =new Date().getTime();
//            },200)
//        var p = target.localToGlobal(0,0);
//        if(p.x == cx)
//        {
//            var p = target.localToGlobal(1,1);
//            speed = (p.x-cx)/(1);
//        }
//        else
//        {
//            speed = p.x/cx;
//        }

        });

        var addX = 0;
        var addY = 0;

        var _w;
        var _h;
        var tweenObj;
        touchObj.addEventListener('pressmove', function(mouseEvent) {
            if(isMouseDown == false) return;
            _w = mouseEvent.rawX - ax;
            _h = mouseEvent.rawY - ay;
            addX = mouseEvent.rawX - mx;
            addY = mouseEvent.rawY - my;
            ax = mouseEvent.rawX;
            ay = mouseEvent.rawY;
            _this.mouseMoveHandler({"addX":addX,"addY":addY});
            timestamp  =new Date().getTime();
        });
        var tweenTime;
        touchObj.addEventListener('pressup', function(mouseEvent) {
            isMouseDown = false;

//            clearInterval(intervalNo);
            _this.tweenHandler();
        });

        _this.mouseMoveHandler = function (moveNumObj)
        {
            if(this.type == "heng")
            {
                target.x =cx + moveNumObj.addX/speed;
                if(target.y > cy)
                {
                    _this.arrow = "right";
                }
                else if(target.y < cy)
                {
                    _this.arrow = "left";
                }

            }
            else if(this.type == "shu")
            {
                target.y =cy + moveNumObj.addY/speed;
                if(target.y > cy)
                {
                    _this.arrow = "down";
                }
                else if(target.y < cy)
                {
                    _this.arrow = "up";
                }

            }

            _this.astrict();
        }
        _this.astrict = function ()
        {
            if(this.type == "heng")
            {
                if(target.x <-length)
                {
                    target.x = -length;
                }
                else if(target.x > 0)
                {
                    target.x = 0;
                }
            }
            else if(this.type == "shu")
            {
                if(target.y <-length)
                {
                    target.y = -length;
                }
                else if(target.y > 0)
                {
                    target.y = 0;
                }
            }
        }
        _this._getTweenX = function ()
        {
            return target.x;
        }
        _this._setTweenX = function (value)
        {
            target.x = value;
            _this.astrict();
        }
        _this._getTweenY = function ()
        {
            return target.y;
        }
        _this._setTweenY = function (value)
        {
            target.y = value;
            _this.astrict();
        }
        Object.defineProperties(_this, {
            tweenX: { get: _this._getTweenX, set: _this._setTweenX },
            tweenY: { get: _this._getTweenY, set: _this._setTweenY }
        });
        _this.tweenHandler = function ()
        {
            var value;
            if(this.type == "heng")
            {
                value = _w;
                tweenObj = createjs.Tween.get(_this).to({"tweenX":target.x + value/_this.speed*10},500,createjs.Ease.get(1))//*10 做缓动效果
            }
            else if(this.type == "shu")
            {
                value = _h;
                tweenObj = createjs.Tween.get(_this).to({"tweenY":target.y + value/_this.speed*10},500,createjs.Ease.get(1))
            }

        }
    }
    cls.MoveControl = MoveControl;
}());
