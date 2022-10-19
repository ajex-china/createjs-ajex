/**
 * Created by ajex on 2016/11/17.
 */
//图形工具类
var GraphicsUtils = {};
GraphicsUtils.lineTo = function(target, start , end, dash, dashStart)
{
    if (!isNaN(dashStart) && start && end)
    {
        var offest = new createjs.Point(end.x - start.x,end.y - start.y)
//        var offest = end.subtract(start);
        var pointLength = Math.sqrt(offest.x*offest.x + offest.y*offest.y);
        var len = pointLength / (dash + dash);
        var dl = 1 / len;
        var sl = dl * dashStart;
        for (var i = 0;i < len;i++)
        {
            var s = GraphicsUtils.pointInterpolate(start,end, dl * i + sl);
            var e = GraphicsUtils.pointInterpolate(start,end, dl * i + dl / 2 + sl);
            target.moveTo(s.x,s.y);
            target.lineTo(e.x,e.y);
        }
    }
    else
    {
        if (start)
            target.moveTo(start.x,start.y);
        if (end)
            target.lineTo(end.x,end.y);
    }
}
GraphicsUtils.pointInterpolate = function (p1,p2,f)
{
    var initPoint = new createjs.Point(p1.x < p2.x?p1.x:p2.x,p1.y < p2.y?p1.y:p2.y);
    if(f < 0)
    {
        f = 0;
    }
    else if(f > 1)
    {
        f = 1;
    }
    var xLength = Math.abs(p1.x - p2.x)*f;
    var yLength = Math.abs(p1.y - p2.y)*f;
    return new createjs.Point(initPoint.x + xLength,initPoint.y + yLength);
}
GraphicsUtils.drawSector = function(target,x,y,wradius,hradius,fromAngle,toAngle)
{
    var start = fromAngle / 180 * Math.PI;
    if (toAngle % 360 != fromAngle % 360)
    {
        target.moveTo(x,y);
        target.lineTo(x + wradius * Math.cos(start),y + hradius * Math.sin(start));
    }
    else
    {
        target.moveTo(x + wradius * Math.cos(start),y + hradius * Math.sin(start));
    }

    GraphicsUtils.drawCurve(target,x,y,wradius,hradius,fromAngle,toAngle);

    if (toAngle % 360 != fromAngle % 360)
        target.lineTo(x,y);
}
GraphicsUtils.drawRing = function (target,x,y,wradius,hradius,fromAngle,toAngle,inner)
{
    var p = (toAngle % 360 != fromAngle % 360);

    var start = fromAngle / 180 * Math.PI;
    if (p)
    {
        target.moveTo(x + wradius * Math.cos(start) * inner,y + hradius * Math.sin(start) * inner);
        target.lineTo(x + wradius * Math.cos(start),y + hradius * Math.sin(start));
    }
    else
    {
        target.moveTo(x + wradius * Math.cos(start),y + hradius * Math.sin(start));
    }

    GraphicsUtils.drawCurve(target,x,y,wradius,hradius,fromAngle,toAngle);

    var end = toAngle / 180 * Math.PI;
    if (p)
        target.lineTo(x + wradius * Math.cos(end) * inner,y + hradius * Math.sin(end) * inner);
    else
        target.moveTo(x + wradius * Math.cos(end) * inner,y + hradius * Math.sin(end) * inner);

    GraphicsUtils.drawCurve(target,x,y,wradius * inner,hradius * inner,toAngle,fromAngle);

    if (p)
        target.lineTo(x + wradius * Math.cos(start),y + hradius * Math.sin(start));
}
GraphicsUtils.drawCurve = function(target,x,y,wradius,hradius,fromAngle,toAngle)
{
    var start = fromAngle / 180 * Math.PI;
    var angle = (toAngle - fromAngle) / 180 * Math.PI;
    var n = Math.ceil(Math.abs(angle) / (Math.PI / 4));
    var angleS = angle / n;
    for (var i = 1;i <= n;i++)
    {
        start += angleS;
        var angleMid = start - angleS / 2;
        var bx = x + wradius / Math.cos(angleS / 2) * Math.cos(angleMid);
        var by = y + hradius / Math.cos(angleS / 2) * Math.sin(angleMid);
        var cx = x + wradius * Math.cos(start);
        var cy = y + hradius * Math.sin(start);
        target.quadraticCurveTo(bx,by,cx,cy);
    }
}
GraphicsUtils.drawBezier = function (target,pointList)
{
    var t = 0;
    var p1;
    var p2;
    t = 0;
    target.moveTo(pointList[0].x,pointList[0].y);
    p1 = new createjs.Point(pointList[0].x,pointList[0].y);
    for(var i = 0;i <= 100;i+=2)
    {
        t = i/100;
        p2 = algorithmUtils.getBezierPoint(pointList,t);
        target.lineTo(p2.x,p2.y);
        p1 = p2;
    }
}