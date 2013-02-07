define(["Keyboard","Resources"],
function(Keyboard,Resources){
    function keydown(event){
        switch(event.keyCode){
            case Keyboard.KEY_UP:
                this.selectedOption = Math.max(0, this.selectedOption - 1)
            break;
            case Keyboard.KEY_DOWN:
                this.selectedOption = Math.min(this.options.length - 1, 
                                               this.selectedOption + 1)
            break;
            case Keyboard.KEY_ENTER:
            case Keyboard.KEY_SPACE:
                var _this = this;
                setTimeout(function(){
                            _this.selected = false;
                            _this.callback(
                                _this.selectedOption,
                                _this.options[_this.selectedOption]);}
                            , 100);
                this.selected = true;
            break;
        }
    }

    function paintFull(display){
//        if(this.oldOption == this.selectedOption) return; //nothing changed.
        this.oldOption = this.selectedOption

        display.setFill("#000000");
        display.fillRect(0,0,display.width(),display.height());
        display.setFill("#FF0000");
        display.setStroke("#FF0000");
        var size = 50;

        var vert = size*this.selectedOption;
        for(var key in this.options){
            display.fillText(this.options[key],size*2,size+size*key);
        }

        if(Resources.get(this.imageID)==undefined)
            display.strokeRect(size*1.75,size*.75+vert,size/4,size/2);
        else
            display.drawImage(Resources.get(this.imageID),
                96,224-(this.selected?32:0),
                32,32,
                size*1.5,vert+size*.5,
                32,32);
    }

    return function(display, menuOptions, callback){
        this.options = menuOptions;
        this.callback = callback;
        this.keydown = keydown;
        this.paintFull = paintFull; 
        this.update = paintFull;// Repaint the entire screen each frame...
        this.selected = false
        this.imageID = Resources.image("terrain.png");

        var _this = this;
        this.reset = function(){
            this.selectedOption = 0;
            this.oldOption = -1;
        }
        this.reset();
    }
});
