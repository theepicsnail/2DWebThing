define(["TileDisplay", "TiledLevel", "PortalPlayer", "Keyboard", "Direction"],
function(TileDisplay, TiledLevel, PortalPlayer, Keyboard, D){
    var Controls = {
        up:      Keyboard.KEY_W,
        down:    Keyboard.KEY_S,
        left:    Keyboard.KEY_A,
        right:   Keyboard.KEY_D,
        portal1: Keyboard.KEY_Q,
        portal2: Keyboard.KEY_E,
    }
    var P = {
        orange: 0,
        blue: 1,
    }

    return function(){
        var self = this;
        Keyboard.setListener(this)
        this.setLevel = function(level){
        }

        this.restart = function(){
        }

        this.player = new PortalPlayer(this);

        this.keydown = function(event){
            switch(event.keyCode){
                case Controls.up:
                    self.player.move(D.up)
                break;
                case Controls.down:
                    self.player.move(D.down)
                break;
                case Controls.left:
                    self.player.move(D.left)
                break;
                case Controls.right:
                    self.player.move(D.right)
                break;
                case Controls.portal1: 
                    self.player.firePortal(P.orange)
                break;
                case Controls.portal2: 
                    self.player.firePortal(P.blue)
                break;
            }
        } 
    }
})
