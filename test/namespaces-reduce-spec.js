const fs = require('fs');
const namespacesReduce = require('../namespaces-reduce.js');
const namespaces = require('./helpers/namespaces.js');

// Node doesn't have `Object.values` for some reason...
const fileNames = Object.keys(namespaces.internal).map(key => namespaces.internal[key]);
const absoluteFileNames = fileNames.map(fileName =>
  // Passing method directly passes additional arguments which it doesn't like.
   fs.realpathSync(fileName));

describe('namespacesReduce', () => {
  let namespacesMap;

  beforeEach(() => {
    namespacesMap = namespacesReduce(absoluteFileNames);
  });

  it('creates the internal map', () => {
    Object.keys(namespacesMap.internal).forEach((key) => {
      expect(namespacesMap.internal[key]).toEqual(fs.realpathSync(namespaces.internal[key]));
    });
  });

  it('creates the external map', () => {
    expect(namespacesMap.external).toEqual(namespaces.external);
  });
});
