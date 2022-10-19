/**
 * Created by ajex on 2018/4/3.
 * 弹窗管理器
 */
var PopupManager = PopupManager||{
    isInit:false,
    stageWidth:0,//只记录最后一次pop的舞台大小
    stageHeight:0,
    _maskAlpha:0.7,
    _con:null,
    _popwin:null,
    _point:null,
    mask:new createjs.Shape(),
    init:function (){//可以不手动初始化
        this.mask.graphics.beginFill("#000000");
        this.mask.graphics.drawRect(0,0,1,1);
        this.mask.graphics.endFill();
        this.mask.alpha = this._maskAlpha;
        this.mask.addEventListener("click",function(){})
        this.isInit = true;
    },
    show:function (con,popwin,point,showcall){
        this._con = con;
        this._popwin = popwin;
        this._point = point;
        this._showcall = showcall;
        if(!this.isInit) this.init()
        this.stageWidth =  window.innerWidth;
        this.stageHeight = window.innerHeight;
        this.mask.scaleX = this.stageWidth/1;
        this.mask.scaleY = this.stageHeight/1;
        this.mask.x = 0;
        this.mask.y = 0;
        this.mask.alpha = 0;
        this._popwin.alpha = 0;
        if(!point)
        {
            this._popwin.x = this.stageWidth/2;
            this._popwin.y = this.stageHeight/2;
        }
        else
        {
            this._popwin.x = point.x;
            this._popwin.y = point.y;
        }
        this._con.addChild(this.mask);
        this._con.addChild(this._popwin)
        var _this = this;
        createjs.Tween.get(this.mask).to({alpha:this._maskAlpha},500)
        createjs.Tween.get(this._popwin).to({alpha:1},500).call(function (){
            if(_this._showcall)
            {
                _this._showcall.call()
            }
        })
    },
    hide:function (popwin,hidecall)
    {
        this._hidecall = hidecall;
        var alpha = popwin.alpha;
        var _this = this;
        createjs.Tween.get(this.mask).to({alpha:0},500)
        createjs.Tween.get(popwin).to({alpha:0},500).call(function (){
            if(popwin.parent)
            {
                popwin.parent.removeChild(popwin)
            }
            popwin.alpha = alpha;
            if(_this._hidecall)
            {
                _this._hidecall.call();
            }
        })
    }
};

