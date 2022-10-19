/**
 * Created by ajex on 2018/5/10.
 */
//转SpriteSheet统一类
var CacheAsSprite = CacheAsSprite||{
    spriteSheetBuilder:new createjs.SpriteSheetBuilder(),
    cacheMC:function (mc,rect,scale,callBack)
    {
        CacheAsSprite._mc = mc;
        CacheAsSprite._rect = rect;
        CacheAsSprite._callBack = callBack;
        CacheAsSprite.spriteSheetBuilder.addMovieClip(mc,rect,scale);
        CacheAsSprite.spriteSheetBuilder.addEventListener("progress",CacheAsSprite.progress)
        CacheAsSprite.spriteSheetBuilder.addEventListener("complete",CacheAsSprite.complete)
        CacheAsSprite.spriteSheetBuilder.buildAsync();
},
    cacheMC2:function (mc,rect,scale,callBack)
    {
        CacheAsSprite._mc = mc;
        CacheAsSprite._rect = rect;
        CacheAsSprite._callBack = callBack;
        mc.gotoAndStop(0);
        for(var i = 0;i < mc.totalFrames;i++)
        {
            CacheAsSprite.spriteSheetBuilder.addFrame(mc,rect,scale,CacheAsSprite._MCFrameHandler,{"i":i});
        }
        CacheAsSprite.spriteSheetBuilder.addEventListener("progress",CacheAsSprite.progress)
        CacheAsSprite.spriteSheetBuilder.addEventListener("complete",CacheAsSprite.complete)
        CacheAsSprite.spriteSheetBuilder.buildAsync();
    },
    _MCFrameHandler:function (mc, data)
    {
        mc.gotoAndStop(data.i);
//        mc.cache(CacheAsSprite._rect.x,CacheAsSprite._rect.y,CacheAsSprite._rect.width,CacheAsSprite._rect.height)
//        stage.update();
    },
    progress:function (event)
    {

    },
    complete:function (event)
    {
        CacheAsSprite.spriteSheetBuilder.removeEventListener("progress",CacheAsSprite.progress)
        CacheAsSprite.spriteSheetBuilder.removeEventListener("complete",CacheAsSprite.complete)
        CacheAsSprite.spriteSheetBuilder.stopAsync();
        if( CacheAsSprite._callBack)
        {
            CacheAsSprite._callBack.call(this,CacheAsSprite.spriteSheetBuilder.spriteSheet)
        }
    }
}
