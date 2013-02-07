define(["jquery"],function($){
	var listener = undefined;
	function onMouseDown(event){
		if(listener && listener.mousedown)
		listener.mousedown.call(listener,event);
	}
	function onMouseUp(event){
		if(listener && listener.mouseup)
		listener.mouseup.call(listener,event);
	}
	function onMouseClick(event){
		if(listener && listener.mouseclick)
		listener.mouseclick.call(listener,event);
	}
	function onMouseMove(event){
		if(listener && listener.mousemove)
		listener.mousemove.call(listener,event);
	}

	$('body').mousemove(onMouseMove);
	$('body').click(onMouseClick);
	$('body').mousedown(onMouseDown);
	$('body').mouseup(onMouseUp);
	

	return {
		setListener: function(obj){ listener = obj; }
	}
});
