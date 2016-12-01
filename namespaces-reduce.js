const fs = require('fs');

module.exports = function fileReduce(fileNames) {
  return fileNames.reduce((namespaces, filePath) => {
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

        /* eslint-disable no-param-reassign */
        namespaces.internal[internalClass] = fs.realpathSync(filePath);
        delete namespaces.external[internalClass];
        /* eslint-enable no-param-reassign */
      }

      const superClassMatch = /^class\s+\S+\s+extends\s+(\S+)/.exec(source);

      if (superClassMatch) {
        const superClass = superClassMatch[1];

        if (!namespaces.internal[superClass]) {
          /* eslint-disable no-param-reassign */
          namespaces.external[superClass] = superClass.toLowerCase();
          /* eslint-enable no-param-reassign */
        }
      }
    }

    return namespaces;
  }, { internal: {}, external: {} });
};
