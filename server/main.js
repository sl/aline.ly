'use strict';

const server = require('./src/server.js');

const colorutils = require('./src/util/colorutil.js');
const linemanager = require('./src/util/linemanager.js');

// get the configuration file for the current environment, fallback to dev
const config = require('./config.json')[process.env.NODE_ENV || 'dev'];

const main = async function main() {
  colorutils.initializeAllExisting();
  linemanager.setup();
  if (config.ip) {
    server.listen(config.port);
  } else {
    server.listen(config.port, config.ip);
  }
  console.log(`listening on ${config.ip || ''}:${config.port}`);
};

main();
