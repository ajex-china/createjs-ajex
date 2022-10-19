//容器基类
//宽高还有bug 现在不计算旋转 之后需要通过 localToGlobal(4个点) 来封装
var Soul = Soul||{};
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
