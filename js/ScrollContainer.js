var Soul = Soul||{};
//滚动容器
(function() {
    function ScrollContainer(content,rect,scrollBar){
        this.BaseContainer_constructor(rect.width,rect.height);
        this.content = content;
        this.contentContainer = new createjs.Container();
        this.addChild(this.contentContainer);
        this.backShape = new createjs.Shape();//底shape 防止滚动内容超过鼠标位置后取消滚动事件
        this.backShape.graphics.beginFill("rgba(255,255,255,0.01)");
        this.backShape.graphics.drawRect(0,0,rect.width,rect.height);
        this.backShape.graphics.endFill();
        this.contentContainer.addChild(this.backShape);
        this.maskShape = new Soul.BaseShape();//遮罩Shape
        this.maskShape.graphics.beginFill("rgba(0,0,0,1)");
        this.maskShape.graphics.drawRect(0,0,rect.width,rect.height);
        this.maskShape.graphics.endFill();
        this.maskShape.setBounds(0,0,rect.width,rect.height)
        this.contentContainer.mask = this.maskShape;
        this.contentContainer.addChild(content);
        this.rect = rect;
        this.scrollBar = scrollBar;
        this.isTouchMove = true;//是否可以点击内容拖动

        if(stage) stage.enableMouseOver(10);

        if(!content) return;
        if(!content.width||!content.height)
        {
            console.log('滚动对象须添加width，height属性，既添加宽高')
        }
        content.mask = this.maskShape;
        var _this = this;
        this.addEventListener("rollover", _this._rollOverHandler = function (event){//保证this指向的同时保存方法的引用 用来随时取消侦听
            _this.rollOverHandler(event);
        })
        this.addEventListener("rollout",_this._rollOutHandler = function (event){
            _this.rollOutHandler(event);
        })
        this.content.addEventListener("mousedown", _this._mousedownHandler = function (event){
            _this.mousedownHandler(event);
        })
        this.content.addEventListener("pressup", _this._mouseupHandler = function (event){
            _this.mouseupHandler(event);
        })

        this.minScrollValue = 0;
        this.maxScrollValue = this.content.height - this.rect.height;


        if(!scrollBar)
        {
            this.scrollBar = new Soul.BaseShape();
            this.scrollBar.graphics.beginFill("rgba(0,0,0,0.5)");
            this.scrollBar.graphics.drawRoundRect(0,0,16,this.rect.height,4,4);
            this.scrollBar.graphics.endFill();
            this.addChild(this.scrollBar);
            this.scrollBar.setBounds(0,0,16,this.rect.height)
            this.scrollBar.x = this.rect.width - 16;
        }
        else {
            if(!scrollBar.width||!scrollBar.height)
            {
                console.log('滚动条须添加width，height属性，既添加宽高');
                return;
            }
            if(this.scrollBar)
            {
                if(this.scrollBar.parent)
                {
                    this.scrollBar.parent.removeChild(this.scrollBar)
                }
            }
            this.scrollBar = scrollBar;
        }
        this.updateThumbSize();
        this.mousePoint = new createjs.Point();
        this.thumbStart = this.scrollBar.y;
        this.thumbLength = this.thumbStart + this.rect.height- this.scrollBar.height;

        this.scrollBar.addEventListener("mousedown",_this._thumbMouseDownHandler = function (event){
            _this.thumbMouseDownHandler(event);
        });
        this.scrollBar.addEventListener("pressup",_this._thumbMouseUpHandler = function (event){
            _this.thumbMouseUpHandler(event);
        });

    }
    var p = createjs.extend(ScrollContainer,Soul.BaseContainer);
    p.updateThumbSize = function ()
    {
        if(this.scrollBar)
        {
            var height = parseInt(this.rect.height*(this.rect.height/this.content.height))
            // this.setRealHeight(this.scrollBar,height )
            this.scrollBar.height = height;
        }

    }
    p.updateScrollNum = function ()
    {
        this.maxScrollValue = this.content.height - this.rect.height;
        // this.thumbStart = this.scrollBar.y;
        this.thumbLength = this.thumbStart + this.rect.height- this.scrollBar.height;
    }
    p.mouseWheelHandler = function (event)
    {
        this.scrollValue = this.scrollValue +  event.deltaY;
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
    p.rollOverHandler = function (event)
    {
        var _this = this;
        canvas.addEventListener("mousewheel", _this._mouseWheelHandler = function (e)
        {
            e = e||window.event;
            if (e.stopPropagation) { //这是取消冒泡
                e.stopPropagation();
            } else{
                e.cancelBubble = true;
            };
            if (e.preventDefault) {//这是取消默认行为，要弄清楚取消默认行为和冒泡不是一回事
                e.preventDefault();
            } else{
                e.returnValue = false;
            };
            _this.mouseWheelHandler(e);
        });
    }
    p.rollOutHandler = function (event)
    {
        var _this = this;
        canvas.removeEventListener("mousewheel", _this._mouseWheelHandler);
    }
    p.mousedownHandler = function (event)
    {
        if(!this.isTouchMove) return
        var _this = this;
        this.firstDownY = event.rawY;
        this.firstScaleY = this.scrollValue;
        this.addEventListener("pressmove", _this._pressmoveHandler = function (event){
            _this.pressmoveHandler(event);
        })
    }
    p.mouseupHandler = function (event)
    {
        this.removeEventListener("pressmove",this._pressmoveHandler)
    }
    p.pressmoveHandler = function (event)
    {
        if(typeof event.rawY == 'undefined') return;
        this.scrollValue = this.firstScaleY - (event.rawY - this.firstDownY);
//        console.log(event.rawY,event.rawY - this.firstDownY)
    }
    p.thumbMouseDownHandler = function (event)
    {
        var point = this.localToLocal(event.rawX,event.rawY,this.scrollBar)
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
        var point = this.localToLocal(event.rawX,event.rawY,this.scrollBar)
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
    p._getWidth = function ()
    {
        return this.rect.width;
    }
    p._setWidth = function (value)
    {
        this.rect.width = value;
        this.maskShape.width = value
        this.updateScrollNum();
        this.updateThumbSize()
    }
    p._getHeight = function ()
    {
        return this.rect.height;
    }
    p._setHeight = function (value)
    {
        this.rect.height = value;
        this.maskShape.height = value
        this.updateScrollNum();
        this.updateThumbSize();
    }
    Object.defineProperties(p, {
        thumbY: { get: p._getThumbY, set: p._setThumbY },
        scrollValue:{get: p._getScrollValue,set: p._setScrollValue},
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight },
    });
    p.destory = function ()
    {
        var _this = this;
        this.BaseContainer_destory();
        this.content.removeEventListener("mousedown", _this._mousedownHandler);
        this.content.removeEventListener("pressup", _this._mouseupHandler);
        this.scrollBar.removeEventListener("mousedown",_this._thumbMouseDownHandler);
        this.scrollBar.removeEventListener("pressup",_this._thumbMouseUpHandler);
    }
    Soul.ScrollContainer = createjs.promote(ScrollContainer, "BaseContainer");
}());
