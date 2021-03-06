function Display(width, height){
    this.canvas = $('<canvas/>')[0];
    this.canvas.width=width;
    this.canvas.height=height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.fps = 30;
    this.renderThread = 0;
    this.sprites = [];
    this.dirty = [];
    this.screen = [0,0];
    this.focus = [2,2]; // cell to ensure is visible or centered if possible
    for(var x = 0; x < width; x += 32)
    {
        this.ctx.moveTo(x,0);
        this.ctx.lineTo(x,height);
    }
    for(var y = 0; y < height; y += 32)
    {
        this.ctx.moveTo(0,y);
        this.ctx.lineTo(width,y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
}

Display.prototype.loadMap = function(map){
    var tilesets = map.tilesets;
    this.tilesetImages = [];
    this.map = map;
    this.tilesToLoad = tilesets.length
    var _this = this;
    this.spriteGrid = CreateArray([map.height,map.width,0])
    this.screen[0] = this.canvas.height / map.tileSize;
    this.screen[1] = this.canvas.width / map.tileSize;
    if((this.canvas.width / map.tileSize % 2 != 1)
    || (this.canvas.height% map.tileSize % 2 != 1)){
        console.warn("Display does not properly fit tilesize")
    }
    
    for(var t in tilesets){
        var ss = new SpriteSheet(tilesets[t]['name'],tilesets[t]['tilewidth']);
        ss.onload = function(){
            console.log("Tilesheet loaded.",_this.tilesToLoad);
            _this.tilesToLoad -= 1;
            if(_this.tilesToLoad == 0){
                _this.mapLoaded();
                for(var row = map.height - 1 ; row >=0 ; --row)
                for(var col = map.width - 1 ; col >=0 ; --col){
                    _this.dirty.push([row,col])
                }
            }
        }
        this.tilesetImages.push(ss);
    }

}

Display.prototype.mapLoaded = function(){
    console.log("Display finished loading tilesheets.")
}

Display.prototype.stopUpdates = function(){
    if(this.renderThread)
        clearInterval(this.renderThread)
    this.renderThread = 0
    this.lastTimestamp = 0
}

Display.prototype.startUpdates = function(fps){
    if(this.renderThread){
        this.stopUpdates();
    }
    this.fps = fps;    
    var _this = this;
    this.renderThread = setInterval(function(){_this.update(_this)}, 1000/this.fps);
}

Display.prototype.addSprite = function(sprite){   
    console.log("Added", sprite, sprite.position.get());
    console.trace()
    var _this = this;
    var pos = sprite.position.get();
    this.dirty.push(pos);
    this.spriteGrid[pos[0]][pos[1]].push(sprite)
    sprite.position.addChangeListener(
        function(o,n){
            if(ValidIndex(_this.spriteGrid,o)){
                _this.dirty[_this.dirty.length]=o;
                var idx = _this.spriteGrid[o[0]][o[1]].indexOf(sprite)
                if(idx!=-1){
                    _this.spriteGrid[o[0]][o[1]].splice(idx,1);
                }
            }else{
                console.warn("Invalid old location for sprite move.",n,o)
            }
            
            if(ValidIndex(_this.spriteGrid,n)){
                _this.dirty[_this.dirty.length]=n;
                _this.spriteGrid[n[0]][n[1]].push(sprite);
            }else{
                console.warn("Invalid new location for sprite move.",n,o)
            }
        }
    );
}


Display.prototype.update=function(_this){
    if(_this.dirty.length==0) return;
    console.log("update.");
    var minVisRow = this.focus[0] - (this.screen[0]-1)/2; 
    var minVisCol = this.focus[1] - (this.screen[1]-1)/2; 
    var maxVisRow = minVisRow + this.screen[0]
    var maxVisCol = minVisCol + this.screen[1]
    var nextDirty = []
    console.log(minVisRow,minVisCol,maxVisRow,maxVisCol);
    var dirty = _this.dirty.concat(_this.map.dirty);
    for(var idx in dirty){
        var pos = dirty[idx];
        var row = pos[0];
        var col = pos[1];
        if(row < minVisRow || col < minVisCol || row > maxVisRow || col > maxVisCol)
            continue;
        var tiles = this.map.tilesAt(pos)//_this.grid[row][col];
        var sprites = this.spriteGrid[row][col];
        row -= minVisRow;
        col -= minVisCol;
        for(var i in tiles){
            var tile = tiles[i];
            if(tile!=0){
                var s = this.tilesetImages[0].getSprite(tile);
                if(s[0] == undefined){
                    console.warn("Trying to draw uninitialized tile.",s)
                    continue;
                }
                _this.ctx.drawImage(
                            s[0],
                            s[1],s[2],
                            s[3],s[3],
                            col*s[3],row*s[3],
                            s[3],s[3])
            }
            
            for(var s in sprites){
                if(sprites[s].layer==i){
                    //draw the sprite
                    var img = sprites[s].getImage();
                    _this.ctx.drawImage(
                        img[0],
                        img[1],img[2],
                        img[3],img[3],
                        col*img[3],row*img[3],
                        img[3],img[3])
            
                }
            }
            
        }
    }
    _this.dirty = nextDirty
    _this.map.dirty = [];
}

Display.prototype.setFocus = function (pos) {
    /*
    XXXXXXXXX
    XXSSSSSXX
    XXSSSSSXX
    XXSSFSSXX   <- F = focus [3,4]
    XXSSSSSXX   <- S = screen [5,5]
    XXSSSSSXX   <- X = unrendered cell
    XXXXXXXXX
    XXXXXXXXX
    XXXXXXXXX
    */
    
    //this.screen = [rows, cols];
    //this.focus = [row, col]
    
    //inclusive min and maxes for pos dimensions
    var minFocusRow = (this.screen[0]-1)/2;
    var minFocusCol = (this.screen[1]-1)/2;
    var maxFocusRow = this.map.height-(this.screen[0]-1)/2-1;
    var maxFocusCol = this.map.width- (this.screen[1]-1)/2-1;
    this.focus[0] = Math.max(minFocusRow,Math.min(maxFocusRow,pos[0]))
    this.focus[1] = Math.max(minFocusCol,Math.min(maxFocusCol,pos[1])) 
    var row = this.focus[0] - (this.screen[0]-1)/2; 
    var col = this.focus[1] - (this.screen[1]-1)/2; 
    for(var dr = 0 ; dr < this.screen[0] ; dr ++)
    for(var dc = 0 ; dc < this.screen[1] ; dc ++){
        this.dirty.push([row + dr, col + dc]);
    }
}
