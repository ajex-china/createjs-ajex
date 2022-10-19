//另一种容器基类，这种容器修改宽高不会被拉伸，而是仅仅修改边界
var Soul = Soul||{};
(function() {
    function MaskContainer(){
        this.Container_constructor();
        this.destoryed = false;
        this.init = true;
        this.maskShape = new createjs.Shape();//遮罩Shape
        this.maskShape.graphics.beginFill("rgba(0,0,0,1)");
        this.maskShape.graphics.drawRect(0,0,rect.width,rect.height);
        this.maskShape.graphics.endFill();
        this.mask = this.maskShape;
    }
    var p = createjs.extend(MaskContainer,createjs.Container);
    p._getWidth = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().width;
    }
    p._setWidth = function (value)
    {
        this._width = value;
        if(!this.getBounds())
        {
            return 0;
        }
        var w =  this._width;
        var h = this.getBounds().height;
        this.setBounds(0,0,w,h);
        this._changeMaskSize(w,h)
    }
    p._getHeight = function ()
    {
        if(!this.getBounds()) return 0;
        return this.getBounds().height;
    }
    p._setHeight = function (value)
    {
        this._height = value;
        if(!this.getBounds())
        {
            return 0;
        }
        var w = this.getBounds().width;
        var h = this._height;
        this.setBounds(0,0,w,h);
        this._changeMaskSize(w,h)
    }
    p._changeMaskSize = function (w,h)
    {
        this.maskShape.graphics.clear();
        this.maskShape.graphics.beginFill("rgba(0,0,0,1)");
        this.maskShape.graphics.drawRect(0,0,w,h);
        this.maskShape.graphics.endFill();
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight }
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
    Soul.MaskContainer = createjs.promote(MaskContainer, "Container");
}());
