const glob = require('glob');
const namespacesReduce = require('../namespaces-reduce.js');

module.exports = function mapper(globPaths) {
  const fileNames = globPaths.reduce((files, file) => files.concat(glob.sync(file)), []);
  const namespacesMap = namespacesReduce(fileNames);

  console.log(namespacesMap); // eslint-disable-line no-console
  return namespacesMap;
};
