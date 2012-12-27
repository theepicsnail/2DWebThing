function SpriteSheet(name,spriteSize){
    this.path = "res/"+name+".png";
    this.name = name;

    this.size = spriteSize;
    var _this = this;
    this.image = $("<img/>").attr('src',this.path).load(function(){
        if((this.width % _this.size) + (this.height % _this.size) != 0){
            console.warn("Sprite sheet not multiple of sprite size.");
            console.warn("W:",this.width,"H:",this.height,"Size:",_this.size);
        }
        _this.onload(this);
    });
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
    this.direction=SOUTH
}
Sprite.prototype.isDirty = function(){
    return this.dirty;
}
Sprite.prototype.clean = function(){
    this.dirty = false;
}
Sprite.prototype.getImage = function(){
    return [this.img[0],this.sx+this.size*this.direction,this.sy,this.size]
}

Sprite.prototype.move = function(direction){
    this.direction= direction
    var pos = this.position.get().concat()
    switch(direction){
        case SOUTH: pos[0]+=1; break;
        case NORTH: pos[0]-=1; break;
        case EAST:  pos[1]+=1; break;
        case WEST:  pos[1]-=1; break;
    }
    this.position.set(pos);
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
