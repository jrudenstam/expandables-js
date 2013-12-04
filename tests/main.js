require(['../expandables', '../../helper-js/helper'], function( expandables, helper ){
	helper.addEvent(window, 'load', function(){
		expandables.init();
	}, this);
});