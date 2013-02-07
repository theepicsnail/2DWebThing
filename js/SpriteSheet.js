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

