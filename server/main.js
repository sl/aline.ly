'use strict';

const port = 8080;
const server = require('./src/server.js');

const colorutils = require('./src/util/colorutil.js');
const linemanager = require('./src/util/linemanager.js');

const main = async function main() {
  colorutils.initializeAllExisting();
  linemanager.setup();
  server.listen(port);
  console.log(`successfully started server, listening on port ${port}`);
};

main();
