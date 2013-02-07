define(["jquery","TileDisplay","TiledLevel","Character","Keyboard"], 
function($,TileDisplay, Level, Character, Keyboard){
    function checkKeys(){
        var dx = 0 , dy = 0;
        if(Keyboard.down(Keyboard.KEY_UP))
            dy -= 1
        if(Keyboard.down(Keyboard.KEY_DOWN))
            dy += 1
        if(Keyboard.down(Keyboard.KEY_LEFT))
            dx -= 1
        if(Keyboard.down(Keyboard.KEY_RIGHT))
            dx += 1
//        if( !!dx || !!dy )
            this.me.translate(dx,dy)
    } 
    
    return function(display){
        var _this = this;

        this.me = new Character();

        tileDisplay = new TileDisplay();
        Level.load("Level1",function(level){
            tileDisplay.setLevel(level);
            display.attach(tileDisplay);
            tileDisplay.addSprite(_this.me);
        });

        Keyboard.setListener(this);
        this.checkKeys = checkKeys
        setInterval(function (){ _this.checkKeys(); }, 10);
    }
});
