/**
 * Created by ajex on 2021/6/16.
 * 由多点连接成的平滑曲线
 */

var Soul = Soul||{};
(function(){
    function SmoothCurve(though){
        this.EventDispatcher_constructor();
        this.though = though;
    }
    var p = createjs.extend(SmoothCurve,createjs.EventDispatcher);
    p. createFromPath = function(path)
    {
        this.path = path;
        this.refresh();
    }
    p.refresh = function()
    {
        this.beziers = [];

        var i;
        var currentBezier;
        var prevBezier;
        if (this.though)
        {
            var p = this.subtract(this.path[2],this.path[0]);
            p.x /= 4;
            p.y /= 4;
            prevBezier = {};
            prevBezier.start = this.path[0];
            prevBezier.control = this.subtract(this.path[1],p);
            prevBezier.end = new createjs.Point();
            this.beziers.push(prevBezier);
            for (i = 1; i < this.path.length - 1; i++)
            {
                currentBezier = {};
                currentBezier.start = prevBezier.end;
                currentBezier.control = this.add(this.path[i],this.subtract(this.path[i],prevBezier.control));
                currentBezier.end = new createjs.Point();

                currentBezier.start.x = this.path[i].x;
                currentBezier.start.y = this.path[i].y;
                this.beziers.push(currentBezier);
                prevBezier = currentBezier;
            }
            prevBezier.end = this.path[this.path.length-1];
        }
        else
        {
            prevBezier ={};
            prevBezier.start = this.path[0];
            prevBezier.control = this.path[1].clone();
            prevBezier.end = new createjs.Point();
            this.beziers.push(prevBezier);
            for (i = 1; i < this.path.length - 2; i++)
            {
                currentBezier = {};
                currentBezier.start = prevBezier.end;
                currentBezier.control = this.path[i+1].clone();
                currentBezier.end =  new createjs.Point();

                var mid = this.interpolate(prevBezier.control, currentBezier.control, 0.5);
                currentBezier.start.x = mid.x;
                currentBezier.start.y = mid.y;
                this.beziers.push(currentBezier);
                prevBezier = currentBezier;
            }
            prevBezier.end = this.path[this.path.length-1];
        }
    }
    p.parseGraphics = function (target)
    {
        this.refresh();


        target.moveTo(this.path[0].x, this.path[0].y);
        var len = this.beziers.length;
        if (len == 0)
        {
            target.lineTo(this.path[this.path.length-1].x, this.path[this.path.length-1].y);
            return;
        }
        var bezier = this.beziers[0];
        target.moveTo(bezier.start.x, bezier.start.y);
        target.quadraticCurveTo(bezier.control.x, bezier.control.y, bezier.end.x, bezier.end.y);
        for (var i=1; i < len; i++)
        {
            bezier = this.beziers[i];
            target.quadraticCurveTo(bezier.control.x, bezier.control.y, bezier.end.x, bezier.end.y);
        }
    }
    p.subtract = function (point1,point2)
    {
        return new createjs.Point(point1.x-point2.x,point1.y-point2.y);
    }
    p.add = function (point1,point2)
    {
        return new createjs.Point(point1.x+point2.x,point1.y+point2.y);
    }
    p.interpolate = function (point1,point2,f)
    {
        var point = this.subtract(point2,point1);
        point.x = point.x + point.x * (1-f);
        point.y = point.y + point.y * (1-f);
        return point;
    }
    Soul.SmoothCurve = createjs.promote(SmoothCurve,"EventDispatcher")
}())
