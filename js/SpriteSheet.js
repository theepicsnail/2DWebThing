function SpriteSheet(name,spriteSize){
    this.path = "res/"+name+".png";
    this.name = name;

    this.size = spriteSize;
    var _this = this;
    this.horizontalSprites = 0;
    this.image = $("<img/>").attr('src',this.path).load(function(){
        if((this.width % _this.size) + (this.height % _this.size) != 0){
            console.warn("Sprite sheet not multiple of sprite size.");
            console.warn("W:",this.width,"H:",this.height,"Size:",_this.size);
        }
        _this.horizontalSprites = this.width / _this.size;
        _this.onload(this);
    })[0];
}

SpriteSheet.prototype.getSprite = function(id){
    id -=1;
    var col = id % this.horizontalSprites;
    var row = Math.floor(id/this.horizontalSprites);
    return [this.image,col*this.size, row*this.size, this.size];
}

SpriteSheet.prototype.onload = function (img){
    console.log("SpriteSheet loaded:" + this.path);
}

function Sprite(spriteSheet, row, col){
    //
    this.id  = spriteSheet.name+":"+row+":"+col;
    this.size= spriteSheet.size;
    this.sx  = row * spriteSheet.size
    this.sy  = col * spriteSheet.size
    this.img = spriteSheet.image;
    this.position = new ChangeableValue([0,0])
    this.layer = 1;
    this.direction=SOUTH
}
Sprite.prototype.isDirty = function(){
    return this.dirty;
}
Sprite.prototype.clean = function(){
    this.dirty = false;
}
Sprite.prototype.getImage = function(){
    return [this.img,this.sx,this.sy+this.size*this.direction,this.size]
}

Sprite.prototype.move = function(direction,world){
    this.direction= direction
    var pos = this.position.get().concat()
    switch(direction){
        case SOUTH: pos[0]+=1; break;
        case NORTH: pos[0]-=1; break;
        case EAST:  pos[1]+=1; break;
        case WEST:  pos[1]-=1; break;
    }
    if(!ValidIndex(world.layers[0].data,pos))
        return true

    if(!world.collisionAt(pos))
        this.position.set(pos);
    else
        this.position.set(this.position.get())
    return false;
}
Sprite.prototype.attack = function(world){
    var pos = this.position.get().concat()
    switch(this.direction){
        case SOUTH: pos[0]+=1; break;
        case NORTH: pos[0]-=1; break;
        case EAST:  pos[1]+=1; break;
        case WEST:  pos[1]-=1; break;
    }
    return world.breakTile(pos)
}
function timestamp(){ return (new Date()).getTime()/1000.0; }

function AnimatedSprite(spriteSheet, frameList){
    //frameList = [[row,col,length of frame in seconds]]
    //eg:
    //frameList = [[0,0,.25],[1,0,.25],[2,0,.25],[3,0,.25]]
    this.time = 0;
    this.frame = 0;
    this.data = []
    this.times= []
    this.frameCount = frameList.length();
    for(var idx in frameList){
        frame = frameList[idx];
        this.data[idx] = spriteSheet.getSprite(frame[0], frame[1]);
        this.times[idx] = frameList[idx][2];
    }
}
AnimatedSprite.isDirty = function(){
    var now = timestamp();
    var dt = now - this.time;
    if(dt > this.times[this.frame]){
        this.time = now;
        this.frame = (this.frame + 1)%this.frameCount;
        this.isDirty = true;
    }
    return this.isDirty;
}
AnimatedSprite.getData = function(){
    return this.data[this.frame];
}
