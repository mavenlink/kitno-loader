const namespacesReduce = require('../namespaces-reduce.js');
const namespaces = require('./helpers/namespaces.js');

// Node doesn't have `Object.values` for some reason...
const absoluteFileNames = Object.keys(namespaces.internal).map(key => namespaces.internal[key]);


describe('namespacesReduce', () => {
  let namespacesMap;

  beforeEach(() => {
    namespacesMap = namespacesReduce(absoluteFileNames);
  });

  it('creates the internal map', () => {
    Object.keys(namespacesMap.internal).forEach((key) => {
      expect(namespacesMap.internal[key]).toEqual(namespaces.internal[key]);
    });
  });

  it('creates the external map', () => {
    expect(namespacesMap.external).toEqual(namespaces.external);
  });
});
