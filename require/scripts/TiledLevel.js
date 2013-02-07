define("TiledLayer", [], function(){
    function loadLayer(layerData){
        var _this = new Object();
        _this.data    = layerData["data"]    || {};
        _this.height  = layerData["height"]  || 0;
        _this.width   = layerData["width"]   || 0;
        _this.opacity = layerData["opacity"] || 0;
        _this.type    = layerData["type"]    || "";
        _this.visible = layerData["visible"] || true;
        _this.x       = layerData["x"]       || 0;
        _this.y       = layerData["y"]       || 0;
        _this.properties = layerData["properties"] || {}

        _this.at      = function(row,col){
            return _this.data[row*_this.width+col];
        }
        return _this;
    };
    return {
        load:loadLayer
    }
});
define("TiledTileset", ["Resources"], function(R){
    function loadTileset(tilesetData,callback){
        var _this = new Object();
        _this.firstgid   = tilesetData["firstgid"]
        _this.image      = tilesetData["image"]
        _this.imagewidth = tilesetData["imagewidth"]
        _this.imageheight= tilesetData["imageheight"]
        _this.margin     = tilesetData["margin"]
        _this.name       = tilesetData["name"]
        _this.properties = tilesetData["properties"]
        _this.spacing    = tilesetData["spacing"]
        _this.tileheight = tilesetData["tileheight"]
        _this.tilewidth  = tilesetData["tilewidth"]
        _this.imageID    = R.image(_this.name+".png",callback)

        _this.rows = Math.floor(_this.imageheight/_this.tileheight)
        _this.cols = Math.floor(_this.imagewidth/_this.tilewidth)

        _this.tileLocation = function(tid){
            var pos = tid - _this.firstgid;
            if(pos < 0) return undefined;
            
            var x = _this.tilewidth * (pos % _this.cols)
            var y = _this.tileheight* Math.floor(pos/_this.cols)
            return [x,y]
        }
        return _this;
    };

    return {
            load:loadTileset
    }
});
define(["Resources", "TiledLayer", "TiledTileset"], 
function(Resources, Layer, Tileset){
    function loadLevel(level, callback){
        this.id = Resources.level(level+".json",function (data){
            var _this = new Object();

            var count = data["tilesets"].length+1;
            function decrement(){
                count -= 1;
                if(count == 0)
                    callback(_this);
            }

            _this.height = data["height"];
            _this.width  = data["width"];
            _this.layers = [];
            for(var key in data["layers"])
                _this.layers.push(Layer.load(data["layers"][key]));

            _this.orientation = data["orientation"]
            _this.properties = data["properties"]
            _this.tileheight = data["tileheight"]
            _this.tilewidth = data["tilewidth"]
            _this.tilesets = [];
            for(var key in data["tilesets"])
                _this.tilesets.push(Tileset.load(data["tilesets"][key],decrement));

            _this.version = data["version"];

            _this.getTileset = function(tid){
                if(tid == 0) return undefined;
                var ts = undefined;
                for(var tsid in _this.tilesets){
                    if(_this.tilesets[tsid].firstgid > tid)
                        break;
                    ts = _this.tilesets[tsid];
                }
                if(!ts) return undefined;
                return ts;
            }

            decrement()
        });
    }
    return {
        load: loadLevel
    }
});
