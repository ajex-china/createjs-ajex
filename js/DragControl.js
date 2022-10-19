/**
 * Created by ajex on 2018/4/2.
 * 拖拽类
 */
var DragControl = DragControl||{
    dragList:[],
    isPause:false,
    startDrag :function (display)
    {
        if(DragControl.checkDrag(display) >= 0) return
        var drag = new DragControl.Drag(display);
        DragControl.dragList.push(drag)
    },
    stopDrag:function(display)
    {
        var index = DragControl.checkDrag(display);
        var drag = DragControl.dragList[index];
        drag.endDrag();
        DragControl.dragList.splice(index,1);
    },
    checkDrag:function (display)
    {
        var val = -1;
        for(var i = 0;i<DragControl.dragList.length;i++)
        {
            if(DragControl.dragList[i]._display == display) return i
        }
        return val;
    }
};
(function(){
    function Drag(display){
        this.EventDispatcher_constructor();
        this._display = display;
        this.startDrag();
        this.isMouseDown = false;
        this.cx = 0;
        this.cy = 0;
        this.mx = 0;
        this.my = 0;
    }
    var p = createjs.extend(Drag,createjs.EventDispatcher);
    p.startDrag = function ()
    {
        var _this = this;
        _this._display.addEventListener('mousedown',_this._mousedownHandler = function(mouseEvent){
            if(DragControl.isPause) return;
            _this.isMouseDown = true;
            _this.cx = _this._display.x;
            _this.cy = _this._display.y;
            _this.mx = mouseEvent.rawX;
            _this.my = mouseEvent.rawY;

        });
        _this._display.addEventListener('pressmove',_this._pressmoveHandler =  function(mouseEvent) {
            if(DragControl.isPause) return;
            if(_this.isMouseDown == false) return;
            _this.addX = mouseEvent.rawX - _this.mx;
            _this.addY = mouseEvent.rawY - _this.my;
            _this._addMoveHandler(_this.addX,_this.addY);
        });

        _this._display.addEventListener('pressup',_this._pressupHandler =  function(mouseEvent) {
            _this.isMouseDown = false;
        });
    }
    p.endDrag = function ()
    {
        this._display.removeAllEventListeners();
        this.removeAllEventListeners();
        this._display = null;
    }
    p._addMoveHandler = function (addX,addY)
    {
        this.move(this.cx+addX,this.cy+addY)
    }
    p.move = function (_x,_y)
    {
        this._display.x =_x;
        this._display.y =_y;
    }
    DragControl.Drag = createjs.promote(Drag,"EventDispatcher")
}())
