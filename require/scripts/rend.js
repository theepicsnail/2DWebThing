define(function(){
    return function(context, repaintFunction){
        var dirty = [];
        this.markDirty = function(){dirty.push(arguments);};
        this.repaint = function(){
            while(dirty.length != 0){
                console.log(dirty,dirty.length);
                repaintFunction.apply(context,dirty.shift());
            } 
        }
    }
});
