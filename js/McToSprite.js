/**
 * Created by ajex on 2018/10/17.
 * mc转sprite类
 */
var McToSprite = McToSprite||{
    mcList:[],
    returnObject:{},
    isChange:false,
    model:new createjs.EventDispatcher(),
    change:function (mcList){//mc rect scale name
        if(McToSprite.isChange == false)
        {
            McToSprite.mcList = mcList
            McToSprite.returnObject = {};
            McToSprite.startChange()
            var event = new createjs.Event("start");
            McToSprite.model.dispatchEvent(event);
        }
        else
        {
            console.log("正在转化，请转化结束再加入新素材");
            var event = new createjs.Event("error");
            McToSprite.model.dispatchEvent(event);
        }

    },
    startChange:function ()
    {
        McToSprite.isChange = true;
        McToSprite.curData = McToSprite.mcList.shift();
        McToSprite.curData.mc.gotoAndStop(0);
        var spritesheetBuilder = new createjs.SpriteSheetBuilder();
        spritesheetBuilder.addMovieClip(McToSprite.curData.mc,McToSprite.curData.rect,McToSprite.curData.scale);
        spritesheetBuilder.addEventListener("progress",McToSprite.progressHandler)
        spritesheetBuilder.addEventListener("complete",McToSprite.handleComplete)
        spritesheetBuilder.buildAsync();
    },
    progressHandler:function (event)
    {

    },
    handleComplete:function (event)
    {
        var spritesheetBuilder = event.currentTarget;
        spritesheetBuilder.removeAllEventListeners();
        spritesheetBuilder.stopAsync();
        McToSprite.renderCompleteHandler(spritesheetBuilder.spriteSheet)
        McToSprite.nextChange();
    },
    nextChange:function ()
    {
        if (McToSprite.mcList.length > 0)
        {
            McToSprite.startChange();
        }
        else
        {
            McToSprite.changeAllComplete()
        }
    },
    renderCompleteHandler:function (spritesheet)
    {
        var sprite = new createjs.Sprite(spritesheet);
        McToSprite.returnObject[McToSprite.curData.name] = sprite;
    },
    changeAllComplete:function ()
    {
        McToSprite.isChange = false;
        var event = new createjs.Event("complete");
        event.data = McToSprite.returnObject;
        McToSprite.model.dispatchEvent(event);
    }
}