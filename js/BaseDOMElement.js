//矢量基类
var Soul = Soul||{};
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
