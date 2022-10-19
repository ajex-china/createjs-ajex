//fps类
var FPS = {};
FPS.time = 0;
FPS.FPS = 0;
FPS.showText = "";
FPS.startFPS = function (stage){
    FPS.shape = new createjs.Shape();
    FPS.shape.graphics.beginFill("#000000").drawRect(0, 0, 200, 70);
    FPS.txt =new createjs.Text("FPS:", "30px Arial", "#ffffff");
    FPS.container = new createjs.Container();
    stage.addChild(FPS.container);
    FPS.container.addChild(FPS.shape)
    FPS.container.addChild(FPS.txt);
    FPS.container.cache(0,0, 200,70);
    createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
//    setInterval(FPS.TickerFPS,18)
}
FPS.TickerFPS = function (event)
{
    FPS.date = new Date();
    FPS.currentTime = FPS.date.getTime();
    if(FPS.time!=0)
    {
        FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
    }
    FPS.time = FPS.currentTime;
    FPS.txt.text = "FPS: "+FPS.FPS + "\n" + FPS.showText;
    FPS.container.updateCache();
}
FPS.startFPS2 = function (stage)
{
    FPS.txt = document.getElementById("fps");
    createjs.Ticker.addEventListener("tick", FPS.TickerFPS2);
}
FPS.TickerFPS2 = function (event)
{
    FPS.date = new Date();
    FPS.currentTime = FPS.date.getTime();
    if(FPS.time!=0)
    {
        FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
    }
    FPS.time = FPS.currentTime;
    FPS.txt.innerText = "FPS: "+FPS.FPS;
}