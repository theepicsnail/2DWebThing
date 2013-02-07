define(["Sprite"],function(Sprite){
    var STATE_IDLE = 0, STATE_WALKING = 1; 
    var SOUTH = 0, WEST = 1, EAST = 2, NORTH = 3
    function dirty(arg){
        if(arg!==undefined){
            this._dirty = arg
        }
        if(this._dirty) return true;
        return this.sprite.dirty();
    }


    return function(){
        var animData = [
            //walking
            { loop:true, frames:[ //Down
                    {image:"Sprites.png", x:32*0, y:0, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:0, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*2, y:0, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:0, w:32, h:32, t:200},
            ]},
            { loop:true, frames:[ //Left
                    {image:"Sprites.png", x:32*0, y:32, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:32, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*2, y:32, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:32, w:32, h:32, t:200},
            ]},
            { loop:true, frames:[ // Right
                    {image:"Sprites.png", x:32*0, y:64, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:64, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*2, y:64, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:64, w:32, h:32, t:200},
            ]},
            { loop:true, frames:[ //Up
                    {image:"Sprites.png", x:32*0, y:96, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:96, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*2, y:96, w:32, h:32, t:200},
                    {image:"Sprites.png", x:32*1, y:96, w:32, h:32, t:200},
            ]},
            //idle
            { loop:false, frames:[{image:"Sprites.png", x:0, y:0, w:32, h:32, t:0}]},
            { loop:false, frames:[{image:"Sprites.png", x:0, y:32, w:32, h:32, t:0}]},
            { loop:false, frames:[{image:"Sprites.png", x:0, y:64, w:32, h:32, t:0}]},
            { loop:false, frames:[{image:"Sprites.png", x:0, y:96, w:32, h:32, t:0}]},
        ]
        this.sprite = new Sprite(animData)
        this.x = 40
        this.y = 60
        this.z = 1
        this.dir = 0;
        this.dirty = dirty;
        this.dirty(true);
        this.moving = false;

        this.translate = function(x,y,z){
            x = x || 0;
            y = y || 0;
            this.x += x;
            this.y += y;
            this.z += z || 0;

            var wasMoving = this.moving
            var oldDir = this.dir;
            if(x < 0)
                this.dir = WEST
            if(x > 0)
                this.dir = EAST 
            if(y > 0)
                this.dir = SOUTH
            if(y < 0)
                this.dir = NORTH
            this.moving = !!(x||y)
            if(this.moving || (this.moving != wasMoving) || (oldDir != this.dir))
            {
                
                if(oldDir!=this.dir || (this.moving != wasMoving)){
                    this.sprite.stopAnimation();
                    this.sprite.startAnimation((!this.moving)*4+this.dir);
                }
                this.dirty(true);      
            }
        }


        this.draw = function(display){this.sprite.draw(display, this.x, this.y)}
        this.dirty = dirty
    }
});
