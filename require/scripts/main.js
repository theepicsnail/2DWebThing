require(["jquery", "Display", "ListMenu", "LightsOut", "Game", "PortalGame"], 
function( $,        Display,   ListMenu,   LightsOut,   Game,   PortalGame){
    

    function menuSelect(key,val){
        display.detach(menu);
        switch(val){
            case "Lights out":
                new LightsOut(display);            
            break;

            case "RPG Test":
                new Game(display)
            break;

            case "Portal thing":
                new PortalGame(display)
            break;
    
            default:
                display.attach(menu);
                console.warn("Unhandled case:",val);

        }
    }



    $(function() {
        display = new Display(640,480);
        $('body').append(display.domElement());

        menu = new ListMenu(display,
                ["Lights out", "RPG Test", "Portal thing"],
                menuSelect);

        display.attach(menu);
    });
});
