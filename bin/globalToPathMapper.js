const glob = require('glob');
const namespacesReduce = require('../namespaces-reduce.js');

const fileNames = process.argv.slice(2).reduce((files, file) => files.concat(glob.sync(file)), []);
const namespacesMap = namespacesReduce(fileNames);

console.log(namespacesMap); // eslint-disable-line no-console
process.exit();
