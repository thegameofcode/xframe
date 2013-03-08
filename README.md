xframe
======

xfr is a nano JavaScript library to help use HTML5 standard window.postMessage for communicate iframes between cross-domain sites

	xfr()
		.allowOrigins(
			['http://localhost:3001']
		)
		.onMessage(
			function (p_xfr, p_origin, p_json) {
				switch ( p_origin ) {
					case 'http://localhost:3001':
						p_xfr.msg('http://localhost:3002', { 'from' : 'host', 'to' : 'remote2', 'ts' : (new Date()).getTime() } );
						break;
				}
			}
		)
		.create ( 
			'http://localhost:3001/remote1.html' 
		,
			function (p_xfr) {
				p_xfr.msg(
					'http://localhost:3001'
				,
					{ 'from' : 'host', 'to' : 'remote1', 'ts' : (new Date()).getTime() }
				);
			}
		)
		.create ( 'http://localhost:3002/remote2.html' )
	;


