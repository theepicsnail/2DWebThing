function rgb(r,g,b){
    r = (r%256)
    g = (g%256)
    b = (b%256)
    return "rgb("+Math.floor(r)+","+Math.floor(g)+","+Math.floor(b)+")";
}


define("WinScreen",[],function(){
    function paintFull(display){
        if(this.closing){
            display.detach(this);
            this.onClose();
        }

        var t = (+new Date())/500;
        display.setFont("bold 40px Arial");
        display.setStroke("#FF0000")
        display.setFill("#000000")
        display.fillRect(40,100,200,70);
        display.strokeRect(40,100,200,70);

        display.setFill(rgb(
                128+127*Math.sin(t),
                128+127*Math.sin(t+2),
                128+127*Math.sin(t+4)));
        display.fillText("You win!",60,150);
    }

    function close(){
        this.closing = true;
    }


    return function(callback){
        this.paintFull = paintFull;
        this.update = paintFull;
        this.mouseclick = close;
        this.keypress = close;
        this.onClose = callback;
        this.closing = false;
    }
});

define(["jquery","WinScreen"],
function($,WinScreen){
    var cellSize = 40;
    var cellPadding = 6;


    function mouseDown(event){
        var x = event.offsetX;
        var y = event.offsetY;
        x = Math.floor(x/40); 
        y = Math.floor(y/40); 
        this.click(y,x);
    }

    function mouseMove(event){
        var x = event.offsetX;
        var y = event.offsetY;
        x = 
        y = Math.floor(y/cellSize)
    }

    function paintFull(display){
        display.setLineWidth(5);
        display.setFill("#FFFFFF");
        display.fillRect(0,0,display.width(), display.height());
        display.setStroke("#000000");
        for(var r = 0 ; r < this.grid.length ; r ++)
        for(var c = 0 ; c < this.grid[r].length ; c++){
            var cell = this.grid[r][c];
            var val = 255*cell.color;
            display.setFill(rgb(val,val,val));

            var x = cellPadding + cellSize * c;
            var y = cellPadding + cellSize * r;
            var w = cellSize-cellPadding*2;
            display.fillRect(x,y,w,w);
            display.strokeRect(x,y,w,w);
        }
    }

    function update(display){
        var nonZero = 0;
        for(var r = 0 ; r < this.grid.length ; r ++)
        for(var c = 0 ; c < this.grid[r].length ; c++){
            var cell = this.grid[r][c];
            cell.color += (cell.target-cell.color)*.1
            if(Math.abs(cell.target - cell.color) < .001)
                cell.color = cell.target;
            if(cell.color != 0)
                nonZero ++;
        }
        this.paintFull(display); 
        if(nonZero == 0){
            var _this = this;
            display.attach(new WinScreen(
                function(){_this.initalize(_this.difficulty+1);}
            ));
        }
    }

    function toggle(r,c){
        if(r<0 || c<0 || r >= this.grid.length || c >= this.grid[r].length)
            return false;

        this.grid[r][c].target+= .5
        if(this.grid[r][c].target > 1)
            this.grid[r][c].target = 0
        return true
    }

    function click(r,c){
        if(!this.toggle(r,c))
            return;
        this.toggle(r,c-1);
        this.toggle(r,c+1);
        this.toggle(r-1,c);
        this.toggle(r+1,c);
    }
    function shuffle(o){
        for(var j, x, i = o.length; i;
            j = parseInt(Math.random() * i), 
            x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function initialize(clicks){
        this.difficulty = clicks;
        shuffle(this.points);
        for(var idx = 0; idx < clicks; idx++){
            var pt = this.points[idx];
            this.click(pt[0],pt[1]);
            this.click(pt[0],pt[1]);
        }
    }

    function resize(width, height){
        this.points = [];
        this.grid = new Array(height);
        for(var r = 0; r < height ; r ++){
            this.grid[r]=new Array(width);
            for(var c = 0 ; c < width ; c ++){
                this.grid[r][c]={color:0, target:0};
                this.points.push([r,c]);
                this.points.push([r,c]);
            }
        }
    }

    return function(display){
        this.resize = resize;
        this.initalize = initialize;
        this.click = click
        this.toggle = toggle

        this.mousedown = mouseDown

        this.paintFull  = paintFull;
        this.update = update;

        this.difficulty = 0;
        this.points = [];
        this.resize(7,7);
        this.initalize(1);

        display.resize(400,400);
        display.attach(this); 
    }
});






