define(["jquery","Display","ListMenu","Game"], function($,Display,ListMenu,Game){
    var display;


    function menuSelect(key, val){
        switch(val){
            case 'New game':    
            new Game(display); 
            display.detach(mainMenu);
            break;
        }
    }


    
    display = new Display(640,480);
    $('body').append(display.domElement());
    mainMenu = new ListMenu(display, 
                    ["New game", "Continue", "Settings"], 
                    menuSelect);
    display.attach(mainMenu);
    return {}
});
