const fs = require('fs');

const namespaces = {
  internal: {
    KitnoLoader: 'test/example/kitno-loader.source.coffee',
    Loader: 'test/example/loader.source.coffee',
    'This.Other.Awesome.View': 'test/example/double-duplicate-internal-names.source.coffee',
    // 'This.Other.Item': 'test/example/missing-namespace.source.coffee', // PLEASE DO NOT ADD THIS ONE!
    'This.Other.Thing': 'test/example/this/other/thing.coffee',
    'This.Other.View': 'test/example/this/other/view.coffee',
    'My.Awesome.FeatureView': 'test/example/namespace-collision.source.coffee',
    'My.Awesome.FileLayout': 'test/example/multi-namespace.source.coffee',
    'My.Awesome.View': 'test/example/my/awesome/view.coffee',
    'My.Other.Awesome.View': 'test/example/duplicate-names.source.coffee',
    'My.Super.Awesome.View': 'test/example/double-duplicate-names.source.coffee',
  },
  external: {
    Loaders: 'loaders',
    View: 'view',
  },
};

Object.keys(namespaces.internal).forEach((key) => {
  namespaces.internal[key] = fs.realpathSync(namespaces.internal[key]);
});

module.exports = namespaces;
