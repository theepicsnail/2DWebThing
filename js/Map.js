function Map(path){
    try{
        var _this = this;
        $.getJSON("res/"+path+".json",function(json){_this.loadMap(json)});
    }catch(err){
    }
}

Map.prototype.loadMap = function(json){
    this.layers = []
    for(var key in json['layers']){
        this.layers.push(new Layer(json['layers'][key]));
    }
    this.tilesets = []
    for(var key in json['tilesets']){
        this.tilesets.push(json['tilesets'][key])
    }
    
    this.width = json['width']
    this.height= json['height']
    
    this.tileSize = json['tileheight']
    this.mapLoaded(this);
}

Map.prototype.mapLoaded = function (map){
    console.log("Map loaded.",map);
}

Map.prototype.collisionAt = function(pos){
    for(var key in this.layers){
        var layer = this.layers[key];
        if(!layer.collides) continue;
        if(!ValidIndex(layer.data,pos)) return true;
        if(layer.data[pos[0]][pos[1]] != 0) return true;
    }
    return false;
}
    
Map.prototype.tilesAt = function(pos){
    var sprites = [];
    for(var key in this.layers){
        sprites.push(this.layers[key].data[pos[0]][pos[1]])
    }
    return sprites
}

function TileSet(tsData){
    this.firstgid = 0;
    this.image = "";
    
}

function Layer(layerData){
    this.data = CreateArray([layerData['height'],layerData['width']],0);
    this.width = layerData['width'];
    this.height = layerData['height'];
    
    var i = this.width*this.height;
    for(var row = layerData['height']-1; row >= 0 ; --row)
    for(var col = layerData['width']-1; col >= 0 ; --col){
        this.data[row][col] = layerData['data'][--i];
    }
    
    var props = layerData["properties"]||{}
    this.collides = props["collision"] != undefined
    this.spriteLayer = props["sprite"] != undefined
}
