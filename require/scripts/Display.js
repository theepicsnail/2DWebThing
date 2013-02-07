define(["jquery","Keyboard","Mouse"], 
    function($,Keyboard,Mouse){

        function attachScreen(screen){
            console.log("Attach screen",screen,this.screens);
            this.screens.push(screen);
            Keyboard.setListener(screen);
	        Mouse.setListener(screen);
            this.currentScreen = screen;
            screen.paintFull(this);
        }
        function detachScreen(screen){
            console.log("Detach screen",screen,this.screens);
            this.screens = $.grep(this.screens,
                function (val){ return val != screen; });
            var newTop = this.screens[this.screens.length-1];
            Keyboard.setListener(newTop);
	        Mouse.setListener(newTop);
            if(newTop)
                newTop.paintFull(this);
            this.currentScreen = newTop;
        }

        function repaint(){
            if(this.currentScreen)
                this.currentScreen.update(this);
        }

        return function(){
            var _this = this;
           
            var canvas = $("<canvas/>")[0];
            //canvas.width = 640;                
//            canvas.height = 480;                
            canvas.width = 320;
            canvas.height = 240;
            
            var ctx = canvas.getContext('2d');            
            ctx.font = "bold 16px Arial";            


            //Exports
            this.domElement = function(){ return canvas; }
            
            this.screens = [];
            this.currentScreen = undefined;
            this.attach = attachScreen;
            this.detach = detachScreen;

            this.width = function(){ return canvas.width; } 
            this.height = function(){ return canvas.width; } 
            this.resize = function(w,h){ canvas.width = w; canvas.height = h; }

            //drawing
            this.setLineWidth = function(w){ctx.lineWidth = w;}
            this.setFont    = function(style){ctx.font = style;}
            this.setFill    = function(style){ctx.fillStyle = style;}
            this.fillRect   = function(x,y,w,h){ctx.fillRect(x,y,w,h);}
            this.fillText   = function(m,x,y){ctx.fillText(m,x,y);}
            
            this.setStroke  = function(style){ctx.strokeStyle = style;}
            this.strokeRect = function(x,y,w,h){ctx.strokeRect(x,y,w,h);}
            this.strokeText = function(m,x,y){ctx.strokeText(m,x,y);}

            this.moveTo     = function(x,y){ctx.moveTo(x,y);}
            this.lineTo     = function(x,y){ctx.lineTo(x,y);}

            this.drawImage  = function(){
                                switch(arguments.length){
                                    case 3:
                                    case 5:
                                    case 9:
                                    ctx.drawImage.apply(ctx,arguments);
                                    break;
                                    case 7:
                                    ctx.drawImage.apply(ctx,arguments.concat(arguments.slice(5)));
                                    break;
                                    default:
                                    console.error("Invald call to drawImage.",arguments);
                                }
                            }
            //refresh
            this.interval = setInterval(function(){repaint.call(_this);},10);
        }
    }
);
