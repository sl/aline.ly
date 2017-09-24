'use strict';

let port = 8080;
const server = require('./src/server.js');

const colorutils = require('./src/util/colorutil.js');
const linemanager = require('./src/util/linemanager.js');

const main = async function main() {
  colorutils.initializeAllExisting();
  linemanager.setup();
  if (false) {
    port = 80;
    server.listen(port, '0.0.0.0');
  } else {
    server.listen(port);
  }
  console.log(`successfully started server, listening on port ${port}`);
};

main();
