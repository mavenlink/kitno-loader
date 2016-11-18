const fs = require('fs');
const path = require('path');
const unboundTransform = require('../index.js');

const query = {
  namespaces: {
    'KitnoLoader': 'test/example/kitno-loader.source.coffee',
    'Loader': 'test/example/loader.source.coffee',
  },
};

const transform = (resourcePath) => {
  const fileContent = fs.readFileSync(resourcePath);

  return unboundTransform.bind({
    context: path.dirname(resourcePath),
    query,
  })(fileContent);
};

it('parses test/kitno-loader.coffee', () => {
  const kitnoLoaderSourcePath = 'test/example/kitno-loader.source.coffee';
  const kitnoLoaderOutput = fs.readFileSync('test/example/kitno-loader.output.coffee');
  expect(transform(kitnoLoaderSourcePath)).toEqual(kitnoLoaderOutput);
});

it('parses test/kitno-loader.coffee', () => {
  const loaderSourcePath = 'test/example/loader.source.coffee';
  const loaderOutput = fs.readFileSync('test/example/loader.output.coffee');
  expect(transform(loaderSourcePath)).toEqual(loaderOutput);
});
