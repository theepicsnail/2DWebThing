define(["jquery"],function($){
    var resources = [];
    var cache = {}

    function checkCache(path){
        return cache[path]
    }
    function setCache(path,val){
        cache[path] = val
    }

    function nextID(){
        var id = resources.length;
        resources[id] = undefined;
        return id;
    }    
    
    function loadImage(path, callback){
        var id = checkCache("image:"+path);
        if(id !== undefined){
            setTimeout(callback);
            return id;
        }
        else
            id = nextID();
        setCache("image:"+path,id);

        var img = new Image();
        img.onload = function(){
            resources[id] = this;
            if(callback)
                callback(img);
        }
        img.src = "resources/"+path;
        return id;
    }
    function loadLevel(path, callback){
        var id = checkCache("level:"+path)
        if (id !== undefined){
            setTimeout(callback);
            return id;
        }else
            id = nextID();
        setCache("level:"+path,id);

        $.getJSON('levels/'+path,function(data){
            resources[id] = data;
            if(callback)
                callback(data);
        });
        return id;
    }


    function getResource(id){
        return resources[id];
    }
    return {
        level:loadLevel,
        image:loadImage,
        get:getResource
    }
});
