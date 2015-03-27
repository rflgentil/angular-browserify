;(function(window, document, undefined) {

'use strict';

var home = (function($scope){
	var _private = {},
		_public = {};

	_public.init = function init(){
		_private.privateMethod();
	};

	_private.privateMethod = function privateMethod(){
		console.log('OK Home');
	};


	return _public.init();
	
});


module.exports = home;

})(window, document);