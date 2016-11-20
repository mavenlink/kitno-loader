const path = require('path');

module.exports = function(source) {
  let newSource = source; // FYI: source has an implicit newline

  // Extract all known global namespaces as imported variables
  const internalNamespaces = this.query.namespaces.internal;
  Object.keys(internalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`${namespace}`);
    const matches = namespaceRegex.exec(source);

    const invalidNamespaceRegex = new RegExp(`class ${namespace}`);
    const invalidMatches = invalidNamespaceRegex.exec(source);

    if (matches && !invalidMatches) {
      const className = namespace;
      const namespacePath = internalNamespaces[namespace];
      const relativeRequirePath = path.relative(this.context, namespacePath);
      const requireStatement = `${className} = require './${relativeRequirePath}'`;
      newSource = `${requireStatement}\n\n\n${newSource}`;
    }
  });

  // Extract all known external namespaces as imported variables
  const externalNamespaces = this.query.namespaces.external;
  Object.keys(externalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`${namespace}`);
    const matches = namespaceRegex.exec(source);

    if (matches) {
      const className = namespace;
      const moduleName = externalNamespaces[namespace];
      const requireStatement = `${className} = require '${moduleName}'`;
      newSource = `${requireStatement}\n\n\n${newSource}`;
    }
  });

  // Export defined class
  const actualClass = /^class\s+(\S+)/.exec(source)[1];
  newSource = `${newSource}\n\nmodule.exports = ${actualClass}\n`;

  return newSource;
};
