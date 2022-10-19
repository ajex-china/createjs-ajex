/**
 * Created by ajex on 2018/9/30.
 */
var LoadControl = LoadControl || {
    model:new createjs.EventDispatcher(),
    assetsList:[],
    totalLoadCount:0,
    isLoad:false,
    currentLoadData:null,
    isXHR:true,
    // adobeID:"",//an2018必备 在an导出的js中
    an_lv:2015,//an的版本 2018以上也用2018作为参数
    loadedLib:{},
    load:function (data)
    {
        if (!data) return;
        if (!data.list) return;
        if (data.list <= 0) return;
        LoadControl.assetsList.push(data);
        LoadControl.totalLoadCount = LoadControl.assetsList.length;
        if(LoadControl.isLoad == false)
        {
            LoadControl.startLoad()
            var event = new createjs.Event("start");
            LoadControl.model.dispatchEvent(event);
        }

    },
    startLoad:function ()
    {
        LoadControl.isLoad = true;
        if (this.assetsList.length > 0) LoadControl.currentLoadData = this.assetsList.shift();
        var loader = new createjs.LoadQueue(LoadControl.isXHR);
        loader.installPlugin(createjs.Sound);
        loader.setMaxConnections(10);
        loader.maintainScriptOrder = true;
        loader.addEventListener("fileload", LoadControl.handleFileLoad);
        loader.addEventListener("progress",LoadControl.progressHandler);
        loader.addEventListener("complete", LoadControl.handleComplete);
        loader.loadManifest(LoadControl.currentLoadData.list);
    },
    handleFileLoad:function (event)
    {
        // var images = window[LoadControl.currentLoadData.images]||{}
        // if (event.item.type == "image") { images[event.item.id] = event.result; }//改成complete时再赋值 防止图片加载快过js 导致放不进去
    },
    progressHandler:function (event)
    {
        if(LoadControl.currentLoadData.progress)
        {
            LoadControl.currentLoadData.progress.call(LoadControl,event)
        }
    },
    handleComplete:function (event)
    {
        var queue = event.target;
        event.currentTarget.removeAllEventListeners();

        var spriteSheetList = LoadControl.checkSpriteSheet(LoadControl.currentLoadData);
        var ss = window.ss||{};
        if(LoadControl.currentLoadData.type == "js")
        {

        }
        else
        {
            if(LoadControl.an_lv == "2018")
            {
                var comp=AdobeAn.getComposition(LoadControl.currentLoadData.adobeID);
                var ss=comp.getSpriteSheet();
                var lib=comp.getLibrary();
                var ssMetadata = lib.ssMetadata;
                for(i=0; i<ssMetadata.length; i++) {
                    ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
                }
            }
            else if(LoadControl.an_lv == "2017")
            {
                var lib = window[LoadControl.currentLoadData.lib];
                var ssMetadata = lib.ssMetadata;
                for(i=0; i<ssMetadata.length; i++) {
                    ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
                }
            }
            if(spriteSheetList.length > 0)
            {
                for(var i=0;i < spriteSheetList.length;i++)
                {
                    ss[spriteSheetList[i].id] = queue.getResult(spriteSheetList[i].id);
                }
            }
            // console.log(queue._loadedResults,queue._loadedRawResults)
            if(LoadControl.an_lv == "2018")
            {
                var images=comp.getImages();
            }
            else
            {
                var images = window[LoadControl.currentLoadData.images]||{}

            }
            for(var i = 0; i < LoadControl.currentLoadData.list.length;i++)
            {
                var a = queue.getResult(LoadControl.currentLoadData.list[i].id);
                // console.log(a,LoadControl.currentLoadData.list[i].id);
                if(a.tagName == "IMG") images[LoadControl.currentLoadData.list[i].id] = a;
                LoadControl[LoadControl.currentLoadData.list[i].id] = a;
            }
        }

        if(LoadControl.currentLoadData.complete)
        {
            LoadControl.currentLoadData.complete.call(LoadControl,event)
        }
        LoadControl.nextLoad();
    },
    nextLoad:function ()
    {
        var progress = LoadControl.assetsList.length / LoadControl.totalLoadCount;
        var loaded = LoadControl.totalLoadCount - LoadControl.assetsList.length;
        var total = LoadControl.totalLoadCount;
        var event = new createjs.Event("progress");
        event.progress = progress;
        event.loaded = loaded;
        event.total = total;
        LoadControl.model.dispatchEvent(event);

        if (LoadControl.assetsList.length > 0)
        {
            LoadControl.startLoad();
        }
        else
        {
            LoadControl.loadAllComplete()
        }
    },
    loadAllComplete:function ()
    {
        LoadControl.isLoad = false;
        LoadControl.assetsList = [];
        LoadControl.totalLoadCount = 0;
        var event = new createjs.Event("complete");
        LoadControl.model.dispatchEvent(event);
    },
    checkSpriteSheet:function(data)
    {
        var backList = [];
        if(data)
        {
            for(var i = 0; i <  data.list.length;i++)
            {
                var obj = data.list[i];
                if(obj.type == "spritesheet")
                {
                    backList.push(obj);
                }
            }

        }
        return backList;
    }
}
