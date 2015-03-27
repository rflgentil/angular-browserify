;(function(window, document, undefined) {

'use strict';

var page = (function($scope){
	var _private = {},
		_public = {};

	_public.init = function init(){
		_private.privateMethod();
	};

	_private.privateMethod = function privateMethod(){
		console.log('OK Page');
	};


	return _public.init();
	
});


module.exports = page;

})(window, document);