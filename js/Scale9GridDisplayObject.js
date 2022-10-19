/**
 * Created by ajex on 2017/3/28.
 */
//位图九宫格
var Soul = Soul||{};
(function() {
    function Scale9GridDisplayObject(source,rectangle,width,height)
    {
        this.BaseContainer_constructor(width,height);


        this._sourceData = new Soul.BaseBitmap(source);
        this.source = source;
//        if(typeof source == 'string'){
//        this._sourceData = new createjs.Bitmap(source);
//        }
//        else{
//        this._sourceData = source.clone();
//        }

        if(rectangle != null){
            this.rect = rectangle;
        }
        else{
            this.rect = new Rectangle(0,0,this._sourceData.width,this._sourceData.height);
        }

        this._width = this._sourceData.width;
        this._height = this._sourceData.height;

        this.grid00 = this.getBitmap(0,			                    0,this.rect.x,				                    this.rect.y);
        this.grid01 = this.getBitmap(this.rect.x,	                    0,this.rect.width,	                            this.rect.y);
        this.grid02 = this.getBitmap(this.rect.x + this.rect.width,	0,this._width - (this.rect.x + this.rect.width),this.rect.y);

        this.grid10 = this.getBitmap(0,			                    this.rect.y,this.rect.x,					                    this.rect.height);
        this.grid11 = this.getBitmap(this.rect.x,	                    this.rect.y,this.rect.width,					                this.rect.height);
        this.grid12 = this.getBitmap(this.rect.x + this.rect.width,	this.rect.y,this._width - (this.rect.x + this.rect.width),	this.rect.height);

        this.grid20 = this.getBitmap(0,			                    this.rect.y + this.rect.height,this.rect.x,					                    this._height - (this.rect.y + this.rect.height));
        this.grid21 = this.getBitmap(this.rect.x,	                    this.rect.y + this.rect.height,this.rect.width,					                this._height - (this.rect.y + this.rect.height));
        this.grid22 = this.getBitmap(this.rect.x + this.rect.width,	this.rect.y + this.rect.height,this._width - (this.rect.x + this.rect.width),	this._height - (this.rect.y + this.rect.height));

        this._minWidth = this.grid00.width+this.grid02.width;
        this._minHeight = this.grid00.height + this.grid20.height;
    }
    var p = createjs.extend(Scale9GridDisplayObject,Soul.BaseContainer);
    p.getBitmap = function (x,y,width,height){
        if(width<=0||height<=0){
            return null
        }
        var bitmap = new Soul.BaseBitmap(this.source);
        bitmap.sourceRect = new createjs.Rectangle(x,y,width,height);
        bitmap.x = x;
        bitmap.y = y;
        this.addChild(bitmap);
        return bitmap;
    }
    p._setWidth = function (value)
    {
        if(value < this._minWidth){
            value = this._minWidth;
        }
        this.update(value - this._width,0);
        this._width = value;

    }
    p._setHeight = function (value)
    {
        if(value< this._minHeight){
            value = this._minHeight;
        }
        this.update(0,value - this._height);
        this._height = value;
    }
    p.update = function (diffW,diffH){
        if(diffW != 0){
            this.diff(this.grid01,"width",diffW);
            this.diff(this.grid11,"width",diffW);
            this.diff(this.grid21,"width",diffW);
            this.diff(this.grid02,"x",diffW);
            this.diff(this.grid12,"x",diffW);
            this.diff(this.grid22,"x",diffW);
         }
        if(diffH != 0){
            this.diff(this.grid10,"height",diffH);
            this.diff(this.grid11,"height",diffH);
            this.diff(this.grid12,"height",diffH);
            this.diff(this.grid20,"y",diffH);
            this.diff(this.grid21,"y",diffH);
            this.diff(this.grid22,"y",diffH);
        }
    }
    p.diff = function (obj,property,diffNum){
        obj[property] += diffNum;
    }
    Object.defineProperties(p, {
        width: { get: p._getWidth, set: p._setWidth },
        height: { get: p._getHeight, set: p._setHeight }
    });
    Soul.Scale9GridDisplayObject = createjs.promote(Scale9GridDisplayObject, "BaseContainer");
}());
