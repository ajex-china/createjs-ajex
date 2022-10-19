/**
 * Created by ajex on 2018/5/7.
 * 连续使用方法时只生效最开始的方法，用来处理连续点击或者控制方法触发频率等情况
 */
var ContinueFunction = ContinueFunction||{
    delay:2000,//间隔时间
    map:new Map(),
    run:function (func)//必须使用引用对象来传输方法，否则此类无效,bind这种类型的也不行
    {
        var map = ContinueFunction.map;
        if(map.has(func))
        {
            var time = map.get(func);
            if((new Date()).getTime() - time < ContinueFunction.delay)
            {
                return
            }
            else//大于间隔时间，可以使用
            {
                map.set(func,(new Date()).getTime());
                func.call(this);
            }
        }
        else//第一次使用，直接使用
        {
            map.set(func,(new Date()).getTime());
            func.call(this);
        }

    },
    keyRun:function (func,key){//直接传输key来识别，用来处理必须使用新方法的场景(比如必须用bind传this的时候)
        var map = ContinueFunction.map;
        if(map.has(key))
        {
            var time = map.get(key);
            if((new Date()).getTime() - time < ContinueFunction.delay)
            {
                return
            }
            else//大于间隔时间，可以使用
            {
                map.set(key,(new Date()).getTime());
                func.call(this);
            }
        }
        else//第一次使用，直接使用
        {
            map.set(key,(new Date()).getTime());
            func.call(this);
        }
    },
    update:function ()
    {
        ContinueFunction.map = new Map();
    }
}