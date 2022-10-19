//矢量基类
//宽高还有bug 现在不计算旋转 之后需要通过 localToGlobal 来封装
var Soul = Soul||{};
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
