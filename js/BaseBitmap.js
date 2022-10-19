//位图基类
//宽高还有bug 现在不计算旋转 之后需要通过 localToGlobal 来封装
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
            _this.dispatchEvent("onload");
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
