const fs = require('fs');
const path = require('path');
const unboundTransform = require('../index.js');

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
      View: 'View',
    },
  },
};

const transform = (resourcePath) => {
  const fileContent = fs.readFileSync(resourcePath);

  return unboundTransform.bind({
    context: path.dirname(resourcePath),
    query,
  })(fileContent);
};

describe("kitno-loader", () => {
  it('parses test/kitno-loader.coffee', () => {
    const kitnoLoaderSourcePath = 'test/example/kitno-loader.source.coffee';
    const kitnoLoaderOutput = fs.readFileSync('test/example/kitno-loader.output.coffee');
    expect(transform(kitnoLoaderSourcePath).toString()).toEqual(kitnoLoaderOutput.toString());
  });

  it('parses test/kitno-loader.coffee', () => {
    const loaderSourcePath = 'test/example/loader.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/loader.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

  it('parses test/multi-namespace.coffee', () => {
    const loaderSourcePath = 'test/example/multi-namespace.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/multi-namespace.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

  it('parses test/namespace-collision.coffee', () => {
    const loaderSourcePath = 'test/example/namespace-collision.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/namespace-collision.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

  it('parses test/duplicate-names.coffee', () => {
    const loaderSourcePath = 'test/example/duplicate-names.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/duplicate-names.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

  it('parses test/double-duplicate-names.coffee', () => {
    const loaderSourcePath = 'test/example/double-duplicate-names.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/double-duplicate-names.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

  it('parses test/double-duplicate-internal-names.coffee', () => {
    const loaderSourcePath = 'test/example/double-duplicate-internal-names.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/double-duplicate-internal-names.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });

});
