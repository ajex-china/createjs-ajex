/**
 * Created by ajex on 2017/5/15.
 */
//贝塞尔曲线
var algorithmUtils = {};
algorithmUtils.zugailv = function (n,k)//组概率
{
    var over = 0;
    over = algorithmUtils.jiecheng(n)/(algorithmUtils.jiecheng(k)*algorithmUtils.jiecheng(n-k));
    return over;
}
algorithmUtils.jiecheng = function (value)
{
    if(value == 0) return 1;
    var base = value;
    var over = value;
    for(var i = 1; i < value;i++)
    {
        base--;
        over *= base;
    }
    return over;
}
algorithmUtils.getBezierPoint = function (pointList,t)//t为阶段 比如：1是线末尾x y位置 0.5就是线画一半时候贝塞尔曲线 x y的位置
{
    var n = pointList.length - 1;
    var b = new createjs.Point();
    for(var i = 0; i < pointList.length;i++)
    {
        b.x += algorithmUtils.zugailv(n,i) * pointList[i].x *Math.pow((1 - t),n-i)*Math.pow(t,i);
        b.y += algorithmUtils.zugailv(n,i) * pointList[i].y *Math.pow((1 - t),n-i)*Math.pow(t,i);
    }
    return b;
}
algorithmUtils.toFloat = function (value) {//保留2位小数

    value = Math.round(parseFloat(value) * 100) / 100;

    if (value.toString().indexOf(".") < 0) {

        value = value.toString() + ".00";

    }

    return parseFloat(value);
}