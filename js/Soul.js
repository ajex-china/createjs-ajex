//位图基类
var Soul = Soul||{};
(function() {
    function BaseBitmap(imageOrUri){
        this.Bitmap_constructor(imageOrUri);
        this.isload = false;
        this.destoryed = false;
        var _this = this;
        this.image.onload = function ()
        {
            _this.isload = true;
            //暂时不在加载完成之后再赋值一遍刚才设置的大小，因为scale和width，height顺序不同会结果不同，如果要提前计入顺序，又太过麻烦
            _this.dispatchEvent("onload")
        }
    }
    var p = createjs.extend(BaseBitmap,createjs.Bitmap);
    p._getWidth = function ()
    {
        if(!this.isload||!this.getBounds()) return 0;
        return this.getBounds().width*this.Bitmap_scaleX;
    }
    p._setWidth = function (value)
    {
        this._width = value;
        if(!this.isload||!this.getBounds())
        {
            console.log("请在图片加载完成之后再设置大小")
            return 0;
        }
        var w = this.getBounds().width;
        this.Bitmap_scaleX = value/w;
    }
    p._getHeight = function ()
    {
        if(!this.isload||!this.getBounds()) return 0;
        return this.getBounds().height*this.Bitmap_scaleY;
    }
    p._setHeight = function (value)
    {
        this._height = value;
        if(!this.isload||!this.getBounds())
        {
            console.log("请在图片加载完成之后再设置大小")
            return 0;
        }
        var h = this.getBounds().height
        this.Bitmap_scaleY = value/h;
    }
    p._getScaleX = function ()
    {
        return this.Bitmap_scaleX
    }
    p._setScaleX = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.Bitmap_scaleX = value;
    }
    p._getScaleY = function ()
    {
        return this.Bitmap_scaleY
    }
    p._setScaleY = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.Bitmap_scaleY = value;
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight },
        scaleX:{ get: p._getScaleX, set: p._setScaleX },
        scaleY:{ get: p._getScaleY, set: p._setScaleY }
    });
    p.destory = function ()
    {
        if (this.destoryed == true)
            return;
        this.removeAllEventListeners();
        if (this.parent)
            this.parent.removeChild(this);

        this.destoryed = true;
    }
    Soul.BaseBitmap = createjs.promote(BaseBitmap, "Bitmap");
}());


//容器基类
(function() {
    function BaseContainer(){
        this.Container_constructor();
        this.destoryed = false;
        this.init = true;

    }
    var p = createjs.extend(BaseContainer,createjs.Container);
    p._getWidth = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().width*this.Container_scaleX;
    }
    p._setWidth = function (value)
    {
        this._width = value;
        if(!this.getBounds())
        {
            return 0;
        }
        var w = this.getBounds().width;
        this.Container_scaleX = value/w;
    }
    p._getHeight = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().height*this.Container_scaleY;
    }
    p._setHeight = function (value)
    {
        this._height = value;
        if(!this.getBounds())
        {
            return 0;
        }
        var h = this.getBounds().height
        this.Container_scaleY = value/h;
    }
    p._getScaleX = function ()
    {
        return this.Container_scaleX
    }
    p._setScaleX = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.Container_scaleX = value;
    }
    p._getScaleY = function ()
    {
        return this.Container_scaleY
    }
    p._setScaleY = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._height = this.getBounds().height*value;
            }
        }
        this.Container_scaleY = value;
    }
    // p.addChild = function (child)
    // {
    //     this.updateWH();
    //     return this.Container_addChild(child);
    // }
    // p.addChildAt = function (child,index)
    // {
    //     this.updateWH();
    //     return this.Container_addChildAt(child,index);
    // }
    // p.removeAllChildren  = function ()
    // {
    //     this.updateWH();
    //     return this.Container_removeAllChildren();
    // }
    // p.removeChild  = function (child)
    // {
    //     this.updateWH();
    //     return this.Container_removeChild(child);
    // }
    // p.removeChildAt  = function (index)
    // {
    //     this.updateWH();
    //     return this.Container_removeChildAt(index);
    // }
    p.updateWH = function ()//如果子集改变后需要遵循父级的宽高规则，则用这个方法刷新（如果由子集自己抛事件来更新的话，那么缓动一大堆x，y，width，height就会由于事件太多造成性能问题）
    {
        if(!this.getBounds())
        {
            return 0;
        }
        if(this._width)//如果有事先设定好的宽度
        {
            var w = this.getBounds().width;
            this.Container_scaleX =  this._width/w;
        }
        if(this._height)
        {
            var h = this.getBounds().height
            this.Container_scaleY =  this._height/h;
        }
        if(this.numChildren  > 0)
        {
            for(var i = 0;i < this.numChildren;i++)
            {
                if(this.getChildIndex(i).updateWH) this.getChildIndex(i).updateWH()
            }
        }
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight },
        scaleX:{ get: p._getScaleX, set: p._setScaleX },
        scaleY:{ get: p._getScaleY, set: p._setScaleY }
    });
    p.destory = function ()
    {
        if (this.destoryed == true)
            return;
        this.removeAllEventListeners();
        this.removeAllChildren();
        if (this.parent)
            this.parent.removeChild(this);

        this.destoryed = true;
    }
    Soul.BaseContainer = createjs.promote(BaseContainer, "Container");
}());

//dom基类
(function() {
    function BaseDOMElement(htmlElement){
        this.DOMElement_constructor(htmlElement);
        this.setBounds(this.htmlElement.offsetLeft,this.htmlElement.offsetTop,this.htmlElement.offsetWidth,this.htmlElement.offsetHeight)
        this.destoryed = false;
    }
    var p = createjs.extend(BaseDOMElement,createjs.DOMElement);
    p._getWidth = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().width*this.DOMElement_scaleX;
    }
    p._setWidth = function (value)
    {
        this._width = value;
        if(!this.getBounds())
        {
            console.log("找不到边界，请使用setBounds手动设置边界后修改");
            return 0;
        }
        var w = this.getBounds().width;
        this.DOMElement_scaleX = value/w;
    }
    p._getHeight = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().height*this.DOMElement_scaleY;
    }
    p._setHeight = function (value)
    {
        this._height = value;
        if(!this.getBounds())
        {
            console.log("找不到边界，请使用setBounds手动设置边界后修改");
            return 0;
        }
        var h = this.getBounds().height
        this.DOMElement_scaleY = value/h;
    }
    p._getScaleX = function ()
    {
        return this.DOMElement_scaleX
    }
    p._setScaleX = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.DOMElement_scaleX = value;
    }
    p._getScaleY = function ()
    {
        return this.DOMElement_scaleY
    }
    p._setScaleY = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.DOMElement_scaleY = value;
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight },
        scaleX:{ get: p._getScaleX, set: p._setScaleX },
        scaleY:{ get: p._getScaleY, set: p._setScaleY }
    });
    p.destory = function ()
    {
        if (this.destoryed == true)
            return;
        this.removeAllEventListeners();
        if (this.parent)
            this.parent.removeChild(this);

        this.destoryed = true;
    }
    Soul.BaseDOMElement = createjs.promote(BaseDOMElement, "DOMElement");
}());

//矢量基类
(function() {
    function BaseShape(graphics){
        this.Shape_constructor(graphics);
        this.destoryed = false;
    }
    var p = createjs.extend(BaseShape,createjs.Shape);
    p._getWidth = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().width*this.Shape_scaleX;
    }
    p._setWidth = function (value)
    {
        this._width = value;
        if(!this.getBounds())
        {
            console.log("找不到边界，请使用setBounds手动设置边界后修改");
            return 0;
        }
        var w = this.getBounds().width;
        this.Shape_scaleX = value/w;
    }
    p._getHeight = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().height*this.Shape_scaleY;
    }
    p._setHeight = function (value)
    {
        this._height = value;
        if(!this.getBounds())
        {
            console.log("找不到边界，请使用setBounds手动设置边界后修改");
            return 0;
        }
        var h = this.getBounds().height
        this.Shape_scaleY = value/h;
    }
    p._getScaleX = function ()
    {
        return this.Shape_scaleX
    }
    p._setScaleX = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.Shape_scaleX = value;
    }
    p._getScaleY = function ()
    {
        return this.Shape_scaleY
    }
    p._setScaleY = function (value)
    {
        if(this.init)//元件在构造之前会自动调用这个方法，那个时候调用getBounds会报错，所以必须在init之后才可以
        {
            if(this.getBounds())
            {
                this._width = this.getBounds().width*value;
            }
        }
        this.Shape_scaleY = value;
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight },
        scaleX:{ get: p._getScaleX, set: p._setScaleX },
        scaleY:{ get: p._getScaleY, set: p._setScaleY }
    });
    p.destory = function ()
    {
        if (this.destoryed == true)
            return;
        this.removeAllEventListeners();
        if (this.parent)
            this.parent.removeChild(this);

        this.destoryed = true;
    }
    Soul.BaseShape = createjs.promote(BaseShape, "Shape");
}());

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
        this.maskShape = new createjs.Shape();//遮罩Shape
        this.maskShape.graphics.beginFill("rgba(0,0,0,1)");
        this.maskShape.graphics.drawRect(0,0,rect.width,rect.height);
        this.maskShape.graphics.endFill();
        this.contentContainer.mask = this.maskShape;
        this.contentContainer.addChild(content);
        this.rect = rect;
        this.scrollBar = scrollBar;

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
        canvas.addEventListener("mousewheel", _this._mouseWheelHandler = function (event)
        {
            _this.mouseWheelHandler(event);
        });
    }
    p.rollOutHandler = function (event)
    {
        var _this = this;
        canvas.removeEventListener("mousewheel", _this._mouseWheelHandler);
    }
    p.mousedownHandler = function (event)
    {
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
    Object.defineProperties(p, {
        thumbY: { get: p._getThumbY, set: p._setThumbY },
        scrollValue:{get: p._getScrollValue,set: p._setScrollValue}
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

