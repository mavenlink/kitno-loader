const fs = require('fs');
const path = require('path');
const unboundTransform = require('../index.js');
const namespaces = require('./helpers/namespaces.js');

// TODO: Could convert this to a string, but `loaderUtils` handle non-String objects.
const query = {
  namespaces,
  kitnoGlobs: ['test/example/my/**/*.coffee', 'test/example/this/**/*.coffee', 'test/example/**/*.source.coffee']
};

const transform = (resourcePath) => {
  const fileContent = fs.readFileSync(resourcePath);

  return unboundTransform.bind({
    context: path.dirname(resourcePath),
    query,
    cacheable: () => {},
  })(fileContent);
};

describe('kitno-loader', () => {
  it('parses test/kitno-loader.coffee', () => {
    const kitnoLoaderSourcePath = 'test/example/kitno-loader.source.coffee';
    const kitnoLoaderOutput = fs.readFileSync('test/example/kitno-loader.output.coffee');
    expect(transform(kitnoLoaderSourcePath).toString()).toEqual(kitnoLoaderOutput.toString());
  });

  it('parses test/loader.coffee', () => {
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

  it('parses test/missing-namespace.coffee', () => {
    const loaderSourcePath = 'test/example/missing-namespace.source.coffee';
    const loaderOutput = fs.readFileSync('test/example/missing-namespace.output.coffee');
    expect(transform(loaderSourcePath).toString()).toEqual(loaderOutput.toString());
  });
});

// Example of bad internal namespaces (because already exported?)
// FakeTable: '/current/app/assets/javascripts/specs/specs/group2/backbone/controls/views/table/cells/string-cell-spec.coffee',
// Testing: '/current/app/assets/javascripts/specs/specs/group2/base/classes/singleton-spec.coffee',
// FakeView: '/current/app/assets/javascripts/specs/specs/group3/backbone/controls/views/qtip-button-spec.coffee',
