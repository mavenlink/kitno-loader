const fs = require('fs');
const glob = require('glob');
const files = process.argv.slice(2).reduce((files, file) => files.concat(glob.sync(file)), []);

const namespaces = files.reduce((namespaces, filePath) => {
  const source = fs.readFileSync(filePath).toString();

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
    const internalMatch = /(?:^|\n)class\s+(\S+)/.exec(source);

    if (internalMatch) {
      const internalClass = internalMatch[1];

      namespaces.internal[internalClass] = fs.realpathSync(filePath);
      delete namespaces.external[internalClass];
    }

    const superClassMatch = /^class\s+\S+\s+extends\s+(\S+)/.exec(source);

    if (superClassMatch) {
      const superClass = superClassMatch[1];

      if (!namespaces.internal[superClass]) {
        namespaces.external[superClass] = true;
      }
    }
  }

  return namespaces;
}, { internal: {}, external: {} })



console.log(namespaces);
process.exit();
