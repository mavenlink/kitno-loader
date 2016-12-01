const fs = require('fs');
const namespacesReduce = require('../namespaces-reduce.js');

// TODO: Extract this to share with specs and switch to be absolute paths.
const query = {
  namespaces: {
    internal: {
      KitnoLoader: 'test/example/kitno-loader.source.coffee',
      Loader: 'test/example/loader.source.coffee',
      'This.Other.Thing': 'test/example/this/other/thing.coffee',
      'This.Other.View': 'test/example/this/other/view.coffee',
      'My.Awesome.View': 'test/example/my/awesome/view.coffee',
    },
    external: {
      Loaders: 'loaders',
      View: 'view',
    },
  },
};

// Node doesn't have `Object.values` for some reason...
const fileNames = Object.keys(query.namespaces.internal).map(key => query.namespaces.internal[key]);
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
      expect(namespacesMap.internal[key]).toEqual(fs.realpathSync(query.namespaces.internal[key]));
    });
  });

  it('creates the external map', () => {
    expect(namespacesMap.external).toEqual(query.namespaces.external);
  });
});
