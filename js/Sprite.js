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

