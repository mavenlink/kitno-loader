const fs = require('fs');
const glob = require('glob');
const files = process.argv.slice(2).reduce((files, file) => files.concat(glob.sync(file)), []);

const stats = files.reduce((stats, filePath) => {
  const source = fs.readFileSync(filePath);

  if (/\.js$/.test(filePath)) {
    /*
     * JavaScript files include:
     * - window assignments via `window.Foo`
     */
  } else if (/\.coffee$/.test(filePath)) {
    /*
     * CoffeeScript files include:
     * - `class` definitions
     * - window assignments via `window.Foo` and `@Foo`
     */
    try {
      // Not sure why but a lot of CoffeeScript files raise:
      // - `TypeError: Cannot read property 'Symbol(Symbol.iterator)' of null`
      const actualClass = /^class\s+(\S+)/.exec(source)[1];
      stats[actualClass] = fs.realpathSync(filePath);
    } catch(error) {
      console.log(`Something went wrong parsing ${filePath}:\n${error}`);
    }
  }

  return stats;
}, {})

console.log(stats);
process.exit();
