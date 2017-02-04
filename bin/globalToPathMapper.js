const glob = require('glob');
const namespacesReduce = require('../namespaces-reduce.js');

module.exports = function mapper(options = {}) {
  const { kitnoGlobs, verbose } = options;
  const fileNames = kitnoGlobs.reduce((files, file) => files.concat(glob.sync(file)), []);
  const namespacesMap = namespacesReduce(fileNames);

  if (verbose) {
    console.log(namespacesMap); // eslint-disable-line no-console
  }

  return namespacesMap;
};
