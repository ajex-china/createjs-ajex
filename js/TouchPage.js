//拖动页面类
(function (cls) {
    this.mx = 0;
    this.my = 0;
    this.cx = 0;
    this.cy = 0;
    this.addX = 0;
    this.addY = 0;
    this.tweenLength;
    this.moveChild;
    this.touchObj
    function TouchPage(touchObject,childList,arrow,rect,scale){
        this.EventDispatcher_constructor();
        var _this = this;
        if(touchObject)
        {
            touchObject.addEventListener("mousedown",_this._mousedown = function (mouseEvent){
                _this.mousedownHandler(mouseEvent);
                _this.dispatchEvent("startTouch");
            });
            touchObject.addEventListener("mouseup",_this._mouseup = function (mouseEvent){
                _this.dispatchEvent("startEnd");
            });
            touchObject.addEventListener("pressmove",_this._pressmove = function (mouseEvent){
               _this.pressmoveHandler(mouseEvent);
                _this.dispatchEvent("pressmove");
            });
            touchObject.addEventListener("pressup",_this._pressup = function (mouseEvent){
                _this.pressupHandler(mouseEvent);
            });
            this.touchObj = touchObject;
        }
        if(childList)
        {
            this.childList = childList;
            this.currentChild = childList[0];
            this.index = 0;
            this.tweenLength = childList.length - 1;//移动次数比移动个数小1
        }
        if(arrow)
        {
            this.arrow = arrow;
        }
        if(rect)
        {
            this.rect = rect;
        }
        if(scale)
        {
            this.scale = scale;
        }

    }
    var p = createjs.extend(TouchPage,createjs.EventDispatcher);
    p.removeControl = function ()
    {
        this.touchObj.removeEventListener("mousedown",this._mousedown);
        this.touchObj.removeEventListener("mousedown",this._mouseup);
        this.touchObj.removeEventListener("pressmove",this._pressmove);
        this.touchObj.removeEventListener("pressup",this._pressup);
    }
    p.mousedownHandler = function (mouseEvent)
    {
        if(this.isTween) return;
        this.cx = this.touchObj.x;
        this.cy = this.touchObj.y;
        this.mx = mouseEvent.rawX-this.cx;
        this.my = mouseEvent.rawY-this.cy;

//        var p = this.touchObj.localToGlobal(0,0);
//        if(p.x == this.cx)
//        {
//            var p = this.touchObj.localToGlobal(1,1);
//            this.scale = (p.x- this.cx)/1;
//        }
//        else
//        {
//            this.scale = p.x/this.cx;
//        }
    }
    p.pressmoveHandler = function (mouseEvent)
    {
        if(this.isTween) return;
        this.addX = mouseEvent.rawX - this.mx;
        this.addY = mouseEvent.rawY - this.my;
        if(this.arrow == "up"||this.arrow == "down")
        {
            this.mouseMoveHandler_updown(this.addY/this.scale);
        }
        else if(this.arrow == "left"||this.arrow == "right")
        {
            this.mouseMoveHandler_leftright(this.addX/this.scale)
        }
    }
    p.pressupHandler = function (mouseEvent)
    {
        if(this.isTween) return;
        var index = this.index;
//        if(index > tweenLength) return;
//        if(this.arrow == "up")
//        {
//            if(this.currentChild.y >  100)
//            {
//                this.changeHandler(this.arrow,index - 1);
//            }
//            else if(this.currentChild.y > 0)
//            {
//                this.resumeHandler(this.fanKey(this.arrow));
//            }
//        }
//        else if(this.arrow == "down")
//        {
//            if(this.currentChild.y < - 100)
//            {
//                this.changeHandler(this.arrow,index + 1);
//            }
//            else if(this.currentChild.y < 0)
//            {
//                this.resumeHandler(this.fanKey(this.arrow));
//            }
//        }
//        else if(this.arrow == "left")
//        {
//            if(this.currentChild.x >  100)
//            {
//                this.changeHandler(this.arrow,index - 1);
//            }
//            else if(this.currentChild.x > 0)
//            {
//                this.resumeHandler(this.fanKey(this.arrow));
//            }
//        }
//        else if(this.arrow == "right")
//        {
//            if(this.currentChild.x <-  100)
//            {
//                this.changeHandler(this.arrow,index + 1);
//            }
//            else if(this.currentChild.x < 0)
//            {
//                this.resumeHandler(this.fanKey(this.arrow));
//            }
//        }
        if(this.arrow == "up"||this.arrow == "down")
        {
            if(this.currentChild.y > 0)
            {
                if(this.currentChild.y >  100)
                {
                    this.changeHandler("up",index - 1);
                }
                else
                {
                    this.resumeHandler("down");
                }
            }
            else if(this.currentChild.y < 0)
            {
                if(this.currentChild.y < - 100)
                {
                    this.changeHandler("down",index + 1);
                }
                else
                {
                    this.resumeHandler("up");
                }
            }
        }
        else if(this.arrow == "left" || this.arrow == "right")
        {
            if(this.currentChild.x < 0)
            {
                if(this.currentChild.x <  -100)
                {
                    this.changeHandler("right",index + 1);
                }
                else
                {
                    this.resumeHandler("left");
                }
            }
            else if(this.currentChild.x > 0)
            {
                if(this.currentChild.x >  100)
                {
                    this.changeHandler("left",index - 1);
                }
                else
                {
                    this.resumeHandler("right");
                }
            }
        }
    }
    p.fanKey = function (key)
    {
        var keyObj = {
            "up":"down",
            "down":"up",
            "left":"right",
            "right":"left"
        }
        return keyObj[key]
    }
    p.mouseMoveHandler_updown = function (moveNum)
    {
        if(this.isTween||moveNum == 0) return;
        var index = this.index;
        if(index > this.tweenLength) return;
        var nn = 0;
        var len = this.rect.height;

        if(moveNum > 0 && index > 0)
        {
            this.moveChild  = this.childList[index-1  ];
            nn = - len;
            if(!this.moveChild.parent)
            {
                this.moveChild.y = - len;
                this.touchObj.addChild(this.moveChild);
            }
            if(this.moveChild)
            {
                this.moveChild.y =this.cy +  moveNum + nn;
                this.currentChild.y =this.cy + moveNum;
            }
        }
        else if(moveNum < 0 && index < this.tweenLength)
        {
            this.moveChild  = this.childList[ index+1 ];
            nn = len
            if(this.moveChild)
            {
                if(!this.moveChild.parent)
                {
                    this.moveChild.y =  len;
                    this.touchObj.addChild(this.moveChild);
                }

                this.moveChild.y =cy +  moveNum + nn;
                this.currentChild.y =cy + moveNum;
            }

        }
    }
    p.mouseMoveHandler_leftright = function (moveNum)
    {
        if(this.isTween||moveNum == 0) return;
        var index = this.index;
        if(index > this.tweenLength) return;
        var nn = 0;
        var len = this.rect.width;

        if(moveNum > 0 && index > 0)
        {
            this.moveChild  = this.childList[index-1  ];
            nn = - len;
            if(!this.moveChild.parent)
            {
                this.moveChild.x = - len;
                this.touchObj.addChild(this.moveChild);
            }
            if(this.moveChild)
            {
                this.moveChild.x =this.cx +  moveNum + nn;
                this.currentChild.x =this.cx + moveNum;
            }
        }
        else if(moveNum < 0 && index < this.tweenLength)
        {
            this.moveChild  = this.childList[ index+1 ];
            nn = len
            if(this.moveChild)
            {
                if(!this.moveChild.parent)
                {
                    this.moveChild.x =  len;
                    this.touchObj.addChild(this.moveChild);
                }

                this.moveChild.x =this.cx +  moveNum + nn;
                this.currentChild.x =this.cx + moveNum;
            }

        }
    }
    p.changeChild = function (arrow,index)
    {
        if(this.isTween) return;
        if(this.index == index) return;
        this.moveChild = this.childList[index];
        this.touchObj.addChild(this.moveChild);
        if(arrow == "down")
        {
            this. moveChild.y = this.rect.height;
        }
        else if(arrow == "up")
        {
            this.moveChild.y = -this.rect.height;
        }
        else if(arrow == "left")
        {
            this.moveChild.x = -this.rect.width;
        }
        else if(arrow == "right")
        {
            this.moveChild.x = this.rect.width;
        }
        this.changeHandler(arrow,index);
    };
    p.changeHandler = function (arrow,index)
    {
        if(index < 0 || index > this.tweenLength) return;
        this.isTween = true;
        this.index = index;
        var _this = this;
        var bi;
        if(arrow == "down")
        {
            var len  = this.rect.height;
            bi = Math.abs((len - Math.abs(_this.currentChild.y))/len);
            //bi = Math.abs(currentChild.y/stageHeight);
            createjs.Tween.get(_this.moveChild).to({y:0},500*bi);
            createjs.Tween.get(_this.currentChild).to({y:-len},500*bi).call(function (){
                _this.delayComplete();
            });
        }
        else if(arrow == "up")
        {
            var len  = this.rect.height;
            bi = Math.abs((len - Math.abs(_this.currentChild.y))/len);
            createjs.Tween.get(_this.moveChild).to({y:0},500*bi);
            createjs.Tween.get(_this.currentChild).to({y:len},500*bi).call(function (){
                _this.delayComplete();
            });
        }
        else if(arrow == "left")
        {
            var len  = this.rect.width;
            bi = Math.abs((len - Math.abs(_this.currentChild.x))/len);
            createjs.Tween.get(_this.moveChild).to({x:0},500*bi);
            createjs.Tween.get(_this.currentChild).to({x:len},500*bi).call(function (){
                _this.delayComplete();
            });
        }
        else if(arrow == "right")
        {
            var len  = this.rect.width;
            bi = Math.abs((len - Math.abs(_this.currentChild.x))/len);
            createjs.Tween.get(_this.moveChild).to({x:0},500*bi);
            createjs.Tween.get(_this.currentChild).to({x:-len},500*bi).call(function (){
                _this.delayComplete();
            });
        }
        // console.log("currentChild.y:" + currentChild.y);
        _this.bi = bi;
        this.changeArrow = arrow;
    }
    p.delayComplete = function ()
    {
        this.isTween = false;
        if(this.currentChild.parent)
        {
            this.currentChild.parent.removeChild(this.currentChild)
        }
        this.currentChild = this.childList[this.index];
        if(this.currentChild.touchPage_callBack)
        {
            this.currentChild.touchPage_callBack.call(this.currentChild);
        }
        this.dispatchEvent("tweenComplete");
//        this.currentChild.showHandler();
    }
    p.resumeHandler = function (arrow)
    {
        var _this = this;
        if(arrow == "down")
        {
            var len = this.rect.height;
            this.bi = Math.abs(_this.currentChild.y/len);
            createjs.Tween.get(_this.currentChild).to({y:0},500*_this.bi);
            createjs.Tween.get(_this.moveChild).to({y:-len},500*_this.bi).call(function (){
                _this.resumeComplete();
            });
        }
        else if(arrow == "up")
        {
            var len = this.rect.height;
            this.bi = Math.abs(_this.currentChild.y/len);
            createjs.Tween.get(_this.currentChild).to({y:0},500*_this.bi);
            createjs.Tween.get(_this.moveChild).to({y:len},500*_this.bi).call(function (){
                _this.resumeComplete();
            });
        }
        else if(arrow == "left")
        {
            var len = this.rect.width;
            this.bi = Math.abs(_this.currentChild.x/len);
            createjs.Tween.get(_this.currentChild).to({x:0},500*_this.bi);
            createjs.Tween.get(_this.moveChild).to({x:-len},500*_this.bi).call(function (){
                _this.resumeComplete();
            });
        }
        else if(arrow == "right")
        {
            var len = this.rect.width;
            this.bi = Math.abs(_this.currentChild.x/len);
            createjs.Tween.get(_this.currentChild).to({x:0},500*_this.bi);
            createjs.Tween.get(_this.moveChild).to({x:len},500*_this.bi).call(function (){
                _this.resumeComplete();
            });
        }
    };
    p.resumeComplete = function ()
    {
        if(this.moveChild)
        {
            if(this.moveChild.parent) this.moveChild.parent.removeChild(this.moveChild);
        }
        this.dispatchEvent("resumeComplete");
    };
    cls.TouchPage = createjs.promote(TouchPage, "EventDispatcher");
})(cls = cls||{});
var cls;