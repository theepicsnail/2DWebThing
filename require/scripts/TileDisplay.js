define(["Resources"],function(R){

    function setLevel(level){
        this.level = level;
        this.fullUpdate = true;
    }

    function paintFull(display){
        if(!this.level)
            return;
        this.fullUpdate = false;

        for(var lid in this.level.layers){
            var layer = this.level.layers[lid];

            for(var row = 0; row < this.level.height ; row ++)
            for(var col = 0; col < this.level.width ; col ++){
                var tid = layer.at(row,col);
                var tileset = this.level.getTileset(tid);
                if(!tileset) continue;
                var loc = tileset.tileLocation(tid);
                display.drawImage(R.get(tileset.imageID),
                              loc[0],
                              loc[1],
                              tileset.tilewidth,
                              tileset.tileheight,
                              col*tileset.tilewidth,
                              row*tileset.tileheight,
                              tileset.tilewidth,
                              tileset.tileheight);

            }
            for(var sid in this.sprites){
                var sprite = this.sprites[sid];
                if(sprite.z < lid) continue;
                sprite.draw(display);
                sprite.dirty(false);
            }
        }
    }

    function update(display){
        if(this.fullUpdate)
            return this.paintFull(display);

        for(var sid in this.sprites){
            if(this.sprites[sid].dirty()){
                this.paintFull(display);
                return;
            }
        }
        

    } 

    function addSprite(sprite){
        this.sprites.push(sprite);
        this.fullUpdate = true;
    }

    return function(){
        this.fullUpdate = true;
        this.sprites = [];
        this.addSprite = addSprite;
        this.setLevel = setLevel;
        this.paintFull = paintFull;
        this.update = update;
    }
});
