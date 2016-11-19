const path = require('path');

module.exports = function(source) {
  const namespaces = this.query.namespaces;
  let newSource = source; // FYI: source has an implicit newline

  // Extract all known global namespaces as imported variables
  Object.keys(namespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`${namespace}\W|$`);
    const matches = namespaceRegex.exec(source);

    const invalidNamespaceRegex = new RegExp(`class ${namespace}`);
    const invalidMatches = invalidNamespaceRegex.exec(source);

    if (matches && !invalidMatches) {
      const className = namespace;
      const namespacePath = namespaces[namespace];
      const relativeRequirePath = path.relative(this.context, namespacePath);
      const requireStatement = `${className} = require './${relativeRequirePath}'`;
      newSource = `${requireStatement}\n\n\n${newSource}`;
    }
  });

  // Export defined class
  const actualClass = /^class\s+(\S+)/.exec(source)[1];
  newSource = `${newSource}\n\nmodule.exports = ${actualClass}\n`;

  return newSource;
};
