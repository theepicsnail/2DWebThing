
function ChangeableValue(val){
    this.value = val;
    this.listeners = []
}
ChangeableValue.prototype.set = function(nVal){
    var oVal = this.value;
    this.value = nVal;
    for(var idx in this.listeners){
        this.listeners[idx](oVal,nVal);
    }
}
ChangeableValue.prototype.get = function(){
    return this.value;
}
ChangeableValue.prototype.addChangeListener = function(callback){
    this.listeners.push(callback);
}
ChangeableValue.prototype.removeChangeListener = function(callback){
    var idx = this.listeners.indexOf(callback);
    if(idx == -1) return;
    this.listeners.splice(idx,1);
}




function CreateArray(dimensions,fillValue){
    var out = []
    var count = dimensions.shift()
    if(dimensions.length==0)
        while(count-->0){
            out[count]=fillValue
        }
    else
        while(count-->0){
            out[count]=CreateArray(dimensions.concat(),fillValue)
        }
    return out;
}

function ValidIndex(array, index){
    if(index.length==0)
        return true;
    if(index[0] < 0)
        return false;
    if(index[0] >= array.length)
        return false;
    return ValidIndex(array[index[0]],index.concat().splice(1))
}

SOUTH=0
WEST =1
EAST =2
NORTH=3


