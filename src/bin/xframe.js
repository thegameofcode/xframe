
var xframe = xfr = function () {

	function _getHost(p_url){
		var protocol = p_url.indexOf('://')+3;
		var firstSlash = p_url.substring(protocol).indexOf('/');
		if ( firstSlash === -1 ) {
			return p_url
		}
		return p_url.substr(0, protocol) + p_url.substr(protocol, firstSlash);
	}

	function _XFrame(){
		var 
			self 			= this
		, 	_readyComplete 	= false
		,	_allowedOrigins = []
		,	__afterReceive	= null
		,	_xframeHost		= null
		;

		function _waitingToReady(){
			if ( !_readyComplete ) {
				if ( document.readyState === 'complete' ) {
					_readyComplete = true;
					_ready();
				}
				else {
					document.addEventListener( "DOMContentLoaded", _waitingToReady, false );
					window.addEventListener( "load", _waitingToReady, false );
				}
			}
		}

		function _ready(){
			document.removeEventListener( "DOMContentLoaded", _waitingToReady, false );
			window.removeEventListener( "load", _waitingToReady, false );
			if (window.addEventListener) {
				window.addEventListener("message", _onMessageReceive, false);
			}
			else {
				window.attachEvent("onmessage", _onMessageReceive);
			}
		}

		function _allowOrigin( p_origin ){
			if ( _allowedOrigins.indexOf( p_origin ) > -1 ){
				return true;
			}
			return false;
		}

		function _onMessageReceive(p_msg){
			if ( _allowOrigin( p_msg.origin ) ){
				_receive( p_msg.origin, JSON.parse( p_msg.data ), p_msg );
			}
			else {
				if ( window.console && console.error ) {
					console.error( 'origin [' +p_msg.origin+'] is not allowed ', _allowedOrigins);
				}
			}
		}

		function _receive(p_origin, p_json, p_source){
			if ( p_json['__xfr__host__'] ) {
				_xframeHost = p_json['__xfr__host__'];
			}
			else if ( __afterReceive != null ) {
				__afterReceive(self, p_origin, p_json, p_source);
			}
		}

		function _IFrame(p_src, f_onload){
			var _iframe = null;
			function _onload(){
				_msg( p_src, {'__xfr__host__' : _getHost( document.location.href ) } );
				if ( f_onload ) {
					f_onload(self);
				}
			}
			function _create(p_src){
				_iframe 	= document.createElement('iframe');
				_iframe.name= _getHost(p_src);
				_iframe.style.display = 'none';
				_appendToBody();
			}
			function _appendToBody(){
				var body = document.getElementsByTagName('body')[0];
				if ( body ) {
					body.appendChild( _iframe );
					_iframe.onload = _onload;
					_iframe.src = p_src;
				}
				else {
					setTimeout( _appendToBody, 100 );
				}
			}
			_create(p_src);
		}

		function _create(p_src, f_onload){
			new _IFrame(p_src, f_onload);
		}

		function _msg (p_destiny, p_json, f_callback) {
			var destiny = _getHost( p_destiny );
			var iframe = window.frames[ destiny ];
			if ( !iframe ) {
				if ( destiny === _xframeHost ) {
					iframe  = window.parent;
				}
				else {
					iframe = window.parent.frames[ destiny ];
				}
			}

			if ( iframe ) {
				iframe.postMessage( 
					JSON.stringify( p_json )
				,
					destiny
				);
			}
			else {
				console.error('destiny ['+destiny+'] is not found');
			}
		}

		this.allowOrigins = function (p_origins) {
			_allowedOrigins = _allowedOrigins.concat( p_origins );
			return this;
		}

		this.create = function (p_src, f_onload) {
			_create(p_src, f_onload);
			return this;
		}

		this.onMessage = function (f_onMessageReceive){
			__afterReceive = f_onMessageReceive;
			return this;
		}

		this.msg = function (p_destiny, p_json){
			console.log( p_destiny, p_json )
			_msg(p_destiny, p_json);
		}

		_waitingToReady();
	}

	window.xframe = window.xfr = xframe;

	return new _XFrame();
};

