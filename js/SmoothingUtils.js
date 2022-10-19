/**
 * Created by ajex on 2018/10/31.
 * 防锯齿
 */
var SmoothingUtils = SmoothingUtils || {
    filters:[new createjs.BlurFilter(2, 2, 1)],
    handler:function (display,rect){
        display.filters = SmoothingUtils.filters;
        display.cache(-2,-2,rect.width+4,rect.height+4);
    }
}
