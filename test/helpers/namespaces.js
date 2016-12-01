const fs = require('fs');

const namespaces = {
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
};

Object.keys(namespaces.internal).forEach((key) => {
  namespaces.internal[key] = fs.realpathSync(namespaces.internal[key]);
});

module.exports = namespaces;
