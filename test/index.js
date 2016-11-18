const fs = require('fs');
const transform = require('../index.js');

it('parses test/kitno-loader.coffee', () => {
  const kitnoLoaderSource = fs.readFileSync('test/example/kitno-loader.source.coffee');
  const kitnoLoaderOutput = fs.readFileSync('test/example/kitno-loader.output.coffee');
  expect(transform(kitnoLoaderSource)).toEqual(kitnoLoaderOutput);
});

it('parses test/kitno-loader.coffee', () => {
  const loaderSource = fs.readFileSync('test/example/loader.source.coffee');
  const loaderOutput = fs.readFileSync('test/example/loader.output.coffee');
  expect(transform(loaderSource)).toEqual(loaderOutput);
});
