function Map(path){
    this.height=0;
    this.width=0;
    this.layers=0;
    this.properties=0;
    this.tilesheets=0;
    this.tilewidth=0;
    this.version=0;
    
    try{
        var _this = this;
        $.getJSON(path,function(json){_this.loadMap(json)});
    }catch(err){
    }
}
Map.prototype.canMove = function(pos){

}

function Layer(layerData){
    this.data = CreateArray([layerData['height'],layerData['width']],0);
    this.width = layerData['width'];
    this.height = layerData['height'];
    
    var i = 0;
    for(var row = layerData['height']-1; row >= 0 ; --row)
    for(var col = layerData['width']-1; col >= 0 ; --col){
        this.data[row][col] = layerData['data'][i++];
    }

    if(layerData.hasOwnProperty('properties')){
        
    }else{

    }

}
