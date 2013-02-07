define("SpriteAnimationFrame",[], function(){
    return function(imgID, x, y, w, h, t){
        this.imageID = imgID;
        this.frameX = x;
        this.frameY = y;
        this.frameWidth = w;
        this.frameHeight = h;
        this.frameDuration = t
    }
});
define("SpriteAnimation",["SpriteAnimationFrame"],function(Frame){
//{{{
    function dirty(nval) { 
        if(nval!==undefined){
            this._dirty = nval;
        }
        return !!this._dirty
    }
    
    function advanceFrame(){
        this.frameNo += 1

        if(this.frameNo == this.frames.length)
        {
            if(this.loop)
                this.frameNo = 0
            else
            {
                this.frameNo -= 1;
                this.stop()
                return 
            }
        }
        var _this = this;
        this.timeout = setTimeout(
                function(){
                    _this.advanceFrame()
                },this.frames[this.frameNo].frameDuration);
        console.log(this.timeout);
        this.dirty(true)
    }

    function start(){
        this.frameNo = -1
        this.advanceFrame();
        console.log("Start");
    }
   
    function stop(){
        console.log("Stop",this.timeout);
        this.frameNo = 0;
        this.dirty(true);
        clearTimeout(this.timeout);
    } 
    
    return function(){
        this.advanceFrame = advanceFrame
        this.dirty = dirty
        this.start = start
        this.stop = stop
        this.loop = true
        this.frameNo = 0;
        this.getFrame = function(){
            return this.frames[this.frameNo];}
        this.frames = [];
    }//}}}
});
define(["Resources", "SpriteAnimation", "SpriteAnimationFrame"], 
function(R, Animation, Frame){

    function draw(display,x,y){
        var anim = this.animations[this.animationID]
        var frame = anim.getFrame();
        if(frame == undefined) return;
        anim.dirty(false);
        display.drawImage(R.get(frame.imageID),
                          frame.frameX,
                          frame.frameY,
                          frame.frameWidth,
                          frame.frameHeight,
                          x,
                          y,
                          frame.frameWidth,
                          frame.frameHeight);
    }

    return function(animData){
        this.animations = [];
        for(var id in animData){
            var curAnim = animData[id];
            var anim = new Animation();
            for(var fid in curAnim.frames){
                var frame = curAnim.frames[fid]
                var imgID = R.image(frame.image);
                anim.frames.push(new Frame(imgID,
                                        frame.x,frame.y,
                                        frame.w,frame.h,
                                        frame.t));
            }
            anim.loop = curAnim.loop
            this.animations.push(anim)
        }
        this.animationID = 0;
        this.startAnimation = function(id){
            var anim = this.animations[this.animationID]
            if(!!anim) anim.stop();

            this.animationID = id;
            this.animations[this.animationID].start();
        }
        this.stopAnimation = function(){
            this.animations[this.animationID].stop();
        } 
        this.dirty = function(arg){
            if(arg!==undefined){
                this._dirty = arg;
            }
            if(this._dirty) return true;

            if(!!this.animations[this.animationID])
            if(this.animations[this.animationID].dirty())
                return true;
            return false;
        } 
        this.draw = draw;
    }
});
