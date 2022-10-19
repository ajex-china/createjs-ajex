//支持滚动轴的容器
var Soul = Soul||{};
(function() {
    function anScrollCtrl(content,rect,scrollBar){
        this.EventDispatcher_constructor();
        this.content = content;
        this.rect = rect;
        this.scrollBar = scrollBar;
        if(!content.width||!content.height)
        {
            console.log('滚动对象须添加width，height属性，既添加宽高')
        }
        if(!scrollBar.width||!scrollBar.height)
        {
            console.log('滚动条须添加width，height属性，既添加宽高')
        }
        var _this = this;
        this.scrollBar.addEventListener("mousedown",_this._thumbMouseDownHandler = function (event){
            _this.thumbMouseDownHandler(event);
        });
        this.scrollBar.addEventListener("pressup",_this._thumbMouseUpHandler = function (event){
            _this.thumbMouseUpHandler(event);
        });
        this.mousePoint = new createjs.Point();
        this.thumbStart = this.scrollBar.y;
        this.thumbLength = this.thumbStart + this.rect.height- this.scrollBar.height;
        this.minScrollValue = 0;
        this.maxScrollValue = this.content.height - this.rect.height;
        this.content.addEventListener("rollover", _this._rollOverHandler = function (event){//保证this指向的同时保存方法的引用 用来随时取消侦听
            _this.rollOverHandler(event);
        })
        this.content.addEventListener("rollout",_this._rollOutHandler = function (event){
            _this.rollOutHandler(event);
        })
    }
    var p = createjs.extend(anScrollCtrl,createjs.EventDispatcher);
    p.rollOverHandler = function (event)
    {
        var _this = this;
        window.addEventListener("mousewheel", _this._mouseWheelHandler = function (event)
        {
            event.preventDefault()
            _this.mouseWheelHandler(event);
        },{ passive: false });
    }
    p.rollOutHandler = function (event)
    {
        var _this = this;
        window.removeEventListener("mousewheel", _this._mouseWheelHandler);
    }
    p.mouseWheelHandler = function (event)
    {
        this.scrollValue = this.scrollValue +  event.deltaY;
    }
    p.thumbMouseDownHandler = function (event)
    {
        var point = this.content.parent.localToLocal(event.rawX,event.rawY,this.scrollBar)
        this.mousePoint.x = point.x*this.scrollBar.scaleX;
        this.mousePoint.y = point.y*this.scrollBar.scaleY;
        this.isDrag = true;
        var _this = this;
        this.scrollBar.addEventListener("pressmove",_this._thumbPressmoveHandler = function (event){
            _this.thumbPressmoveHandler(event)
        });
    }
    p.thumbMouseUpHandler = function (event)
    {
        if(!this.isDrag) return;
        this.scrollBar.removeEventListener("pressmove",this._thumbPressmoveHandler);
        this.isDrag = false;
    }
    p.thumbPressmoveHandler = function (event)
    {
        var point = this.content.parent.localToLocal(event.rawX,event.rawY,this.scrollBar)
        this.thumbY =event.rawY- this.mousePoint.y;
    }
    p._getThumbY = function ()
    {
        return this._thumbY;
    }
    p._setThumbY = function (value)
    {
        if(value < this.thumbStart)
        {
            value = this.thumbStart;
        }
        else if(value > this.thumbLength)
        {
            value = this.thumbLength;
        }
        this._thumbY = value;
        this.scrollBar.y = value;
        this._scrollBarToScrollValue(this.maxScrollValue*((value - this.thumbStart)/(this.thumbLength-this.thumbStart)));
    }
    p._getScrollValue = function ()
    {
        if(typeof this._scrollValue == 'undefined') return this.content.y;
        return this._scrollValue
    }
    p._setScrollValue = function (toY)
    {
        this._scrollValue = Math.max(Math.min(toY,this.maxScrollValue),this.minScrollValue);
        this.content.y = -this._scrollValue;
//        toY = this.maxScrollValue*((value - this.thumbStart)/(this.thumbLength-this.thumbStart))
        var value = toY/this.maxScrollValue * (this.thumbLength-this.thumbStart) + this.thumbStart
        this._scrollValueToScrollBar(value);
    }
    p._scrollValueToScrollBar = function (value)//内部滚动值转滚动条位置（外部和外部之间不能直接互相调用，因为会无限递归循环）
    {
        if(value < this.thumbStart)
        {
            value = this.thumbStart;
        }
        else if(value > this.thumbLength)
        {
            value = this.thumbLength;
        }
        this._thumbY = value;
        this.scrollBar.y = value;

    }
    p._scrollBarToScrollValue = function (value)//内部滚动条位置转滚动值外部和外部之间不能直接互相调用，因为会无限递归循环）
    {
        this._scrollValue = Math.max(Math.min(value,this.maxScrollValue),this.minScrollValue);
        this.content.y = -this._scrollValue;
    }
    Object.defineProperties(p, {
        thumbY: { get: p._getThumbY, set: p._setThumbY },
        scrollValue:{get: p._getScrollValue,set: p._setScrollValue}
    });
    p.destory = function ()
    {
        var _this = this;
        this.content.removeEventListener("mousedown", _this._mousedownHandler);
        this.content.removeEventListener("pressup", _this._mouseupHandler);
        window.removeEventListener("mousewheel", _this._mouseWheelHandler);
    }
    Soul.anScrollCtrl = createjs.promote(anScrollCtrl, "EventDispatcher");
}());
