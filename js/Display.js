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
    for(var x = 0; x < width; x += 48)
    {
        this.ctx.moveTo(x,0);
        this.ctx.lineTo(x,height);
    }
    for(var y = 0; y < height; y += 48)
    {
        this.ctx.moveTo(0,y);
        this.ctx.lineTo(width,y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
}

Display.prototype.setGridDimensions = function(rows, cols){
    this.grid = CreateArray([rows,cols,0])
    this.startUpdates(this.fps);
}

Display.prototype.stopUpdates = function(){
    if(this.renderThread)
        stopInterval(this.renderThread)
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
    var _this = this;
    var pos = sprite.position.get();
    this.dirty.push(pos);
    this.grid[pos[0]][pos[1]].push(sprite)
    sprite.position.addChangeListener(
        function(o,n){
            if(ValidIndex(_this.grid,o)){
                _this.dirty[_this.dirty.length]=o;
                var idx = _this.grid[o[0]][o[1]].indexOf(sprite)
                if(idx!=-1){
                    _this.grid[o[0]][o[1]].splice(idx,1);
                }
            }else{
                console.warn("Invalid old location for sprite move.",n,o)
            }
            
            if(ValidIndex(_this.grid,n)){
                _this.dirty[_this.dirty.length]=n;
                _this.grid[n[0]][n[1]].push(sprite);
            }else{
                console.warn("Invalid new location for sprite move.",n,o)
            }
        }
    );
}
Display.prototype.removeSprite = function(sprite){
    sprite.position.removeChangeListener(this);
//    var idx = this.sprites.indexOf(sprite);
//    if(idx != -1)
//        this.sprites.splice(idx,1);
}



//in the sprites setPosition function you would need to pass the display so that you could draw it.


//Display.prototype.drawSprite = function (sprite){
//    this.ctx.putImageData(sprite.data, sprite.x*48, sprite.y*48);
//}

//Display.prototype.addSprite = function(sprite){
//    this.sprites.push(sprite);
//}

Display.prototype.update=function(_this){
    if(_this.dirty.length==0) return;
    console.log("update.");
    var nextDirty = []
    for(var idx in _this.dirty){
        var pos = _this.dirty[idx];
        var row = pos[0];
        var col = pos[1];
        if(row<0 || col <0 || row >9 || col>9) continue;
        var sprites = _this.grid[row][col];
        for(var i in sprites){
            var s = sprites[i].getImage();
            if(s[0] == undefined){
                console.warn("Trying to draw uninitialized sprite.",s)
//                nextDirty.push(pos);
                continue;
            }
            _this.ctx.drawImage(
                        s[0],
                        s[1],s[2],
                        s[3],s[3],
                        col*s[3],row*s[3],
                        s[3],s[3])
        }
    }
    _this.dirty = nextDirty
}


/*
    if(!this.scene)
    {
        this.stopUpdates();
        return;
    }
    var now = new Date()
    if(this.lastTimestamp == 0){
        this.lastTimestamp = now;
        return;
    }
    var dt = this.lastTimestamp - now;
    this.scene.step(dt);
    if(this.scene.isDirty()){
//        this.scene.
    }


//    var sprites;
//    for(var idx in this.sprites){
//        sprite = this.sprites[idx];
//        if(sprite.isDirty()){
//            this.drawSprite(sprite)
//            sprite.clean();
//        }
//    }
}
*/
