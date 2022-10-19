//视图切换类
var ChangeViewControl = ChangeViewControl || {
    change:function (view,parent,completeFunction,parameterList,cacheRect)
    {
        var show = function (){
            view.alpha = 0;
            parent.addChild(view);
            if(cacheRect) view.cache(cacheRect.x,cacheRect.y,cacheRect.width,cacheRect.height);
            createjs.Tween.get(view).to({"alpha":1},1000).call(function (){
                if(cacheRect) view.uncache();
                if(completeFunction) completeFunction.call(ChangeViewControl,parameterList);
            });
            ChangeViewControl.currentView = view;
        }
        if(ChangeViewControl.currentView)
        {
            if(parent==null)
            {
                parent = ChangeViewControl.currentView.parent;
            }
            if(ChangeViewControl.currentView.parent)
            {
                if(cacheRect) ChangeViewControl.currentView.cache(cacheRect.x,cacheRect.y,cacheRect.width,cacheRect.height);
                createjs.Tween.get(ChangeViewControl.currentView).to({"alpha":0},500).call(function (){
                    if(cacheRect) ChangeViewControl.currentView.uncache();
                    ChangeViewControl.currentView.parent.removeChild(ChangeViewControl.currentView);
                    show();
                })

            }
        }
        else
        {
            show();
        }
    }
}

