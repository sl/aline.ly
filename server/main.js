'use strict';

const port = 8080;
const server = require('./src/server.js');

const colorutils = require('./src/util/colorutil.js');

const main = async function main() {
  colorutils.initializeAllExisting();
  server.listen(port);
  console.log(`successfully started server, listening on port ${port}`);
};

main();
