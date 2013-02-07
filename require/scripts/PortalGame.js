define(["jquery","PortalEnv"], 
function($,       PortalEnv){
    
    return function(display){
        var self = this;/*
        Keyboard.setListener(this);

        this.player = new Character();

        tileDisplay = new TileDisplay();
        Level.load("PortalLevel1",function(level){
            tileDisplay.setLevel(level);
            display.attach(tileDisplay);
            tileDisplay.addSprite(self.player);
        });
        console.log(Keyboard, typeof(Keyboard))
        */
        new PortalEnv()
    }
});
