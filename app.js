
const path = require('path');
const root_dir = path.dirname(require.main.filename);
require(path.join(__dirname, 'bin/server'))



/*
* Manual SSL test
*/
// const fs = require('fs')
// const https = require('https')
// const hostname = 'merlinboyer.fr'
// const httpsPort = 443

// const httpsOptions = {
//     cert: fs.readFileSync('./ssl/server.crt'),
//     ca: fs.readFileSync('./ssl/server.ca-bundle'),
//     key: fs.readFileSync('./ssl/server.key')
// }

// const httpsServer = https.createServer(httpsOptions, server)

// httpsServer.listen(httpsPort, hostname);