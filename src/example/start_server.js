var express = require('express');

console.log('starting...');

var host = express();
host.use( express.static(__dirname) );
console.log('HOST listen on port 3000');
host.listen(3000);

var remote1 = express();
remote1.use( express.static(__dirname) );
console.log('REMOTE1 listen on port 3001');
remote1.listen(3001);

var remote2 = express();
remote2.use( express.static(__dirname) );
console.log('REMOTE2 listen on port 3002');
remote2.listen(3002);

console.log('started');