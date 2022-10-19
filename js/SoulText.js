var Soul = Soul||{};
(function() {
    function SoulText(text,font,color){
        this.Text_constructor(text,font,color);
        this._bold = false;
        this._fontWeight = "normal";
        this._size = 12;
        this._font = "Microsoft YaHei";
        this._setTextFont();
    }
    var p = createjs.extend(SoulText,createjs.Text);
    p._getBold  = function ()
    {
        return this._bold;
    }
    p._setBold= function (value)
    {
        this._bold = value;
        if(this._bold)
        {
            this._fontWeight = "bold";
        }
        else
        {
            this._fontWeight = "normal";
        }
        this._setTextFont();
    }
    p._getSize = function ()
    {
        return this._size;
    }
    p._setSize = function (value)
    {
        this._size = value;
        this._setTextFont();
    }
    p._getFont = function ()
    {
        return this._font;
    }
    p._setFont = function (value)
    {
        this._font = value;
        this._setTextFont();
    }
    p._setTextFont = function ()
    {
        this.font =  this._fontWeight + " " + this._size + "px " + this._font;
    }
    p._getText = function ()
    {
        return this._text;
    }
    p._setText = function (str)
    {
        this._text = str;
        this.text = this._set_br(str);
    }
    p._setLineWidth = function (value)
    {
        this._lineWidth = value;
        this.text = this._set_br(this._text)
    }
    p._getLineWidth = function ()
    {
        return this._lineWidth;
    }
    p._set_br = function (str)//现阶段有bug 没有考虑回车/n的情况
    {
        if(!str) return;
        if(!this.lineWidth) return str;
        var a = parseInt(this.lineWidth/(this.size)*2);//几个字节一行(英文1字节中文2字节)
        var b = Math.ceil(str.length/a);//一共几行
        var _returnStr="";
        var _indexList=[];//需要插入换行的index列表
        var _len = 0;
        var _oldLen = 0;
        var _cur = 0;
        for(var i=0;i<str.length;i++)
        {
            if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
                _len += 2;
            } else {
                _len ++;
            }
            // var _index;
            // if(_indexList.length > 0)
            // {
            //     _index = _indexList[_indexList.length-1];
            // }
            // else
            // {
            //     _index = 0;
            // }
            if(_len - _cur >= a)
            {
                _indexList.push(i)//虽然写着是i 但是是 -1（超出后往后回一位）+1（位置后面+\n）
                _cur = _oldLen;
            }
            _oldLen = _len
        }
        console.log(_indexList);
        for(var i=0;i<_indexList.length;i++)
        {
            var _start;
            var _end;
            if(i == 0)
            {
                _start = 0;
                _end = _indexList[0]
            }
            else
            {
                _start = _indexList[i-1];
                _end = _indexList[i];
            }
            _returnStr += str.slice(_start,_end) + '\n';
        }
        _returnStr += str.slice(_end,str.length)
        // for(var i = 0; i < b ;i++)
        // {
        //     _returnStr += str.slice(i*a,(i+1)*a) + (i>=b-1?"":'\n');
        // }
        return _returnStr;
    }
    Object.defineProperties(p, {
        bold: { get: p._getBold, set: p._setBold },
        size: { get: p._getSize, set: p._setSize },
        fontString: {get: p._getFont, set: p._setFont },
        label: {get: p._getText, set: p._setText },
        lineWidth:{get: p._getLineWidth, set: p._setLineWidth}
    });
    Soul.SoulText = createjs.promote(SoulText, "Text");
}());
