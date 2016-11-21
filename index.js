const path = require('path');

module.exports = function(source) {
  let newSource = `\n\n${source}\n\n`;

  const namespacesToReplace = {};

  // Collect all known global namespaces
  const internalNamespaces = this.query.namespaces.internal;
  Object.keys(internalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`${namespace}`);
    const matches = namespaceRegex.exec(source);

    const invalidNamespaceRegex = new RegExp(`class ${namespace}`);
    const invalidMatches = invalidNamespaceRegex.exec(source);

    if (matches && matches[0] && !invalidMatches) {
      const className = namespace;
      const namespacePath = internalNamespaces[namespace];
      const relativeRequirePath = path.relative(this.context, namespacePath);
      namespacesToReplace[className] = `./${relativeRequirePath}`;
    }
  });

  // Collect all known external namespaces
  const externalNamespaces = this.query.namespaces.external;
  Object.keys(externalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`${namespace}`);
    const matches = namespaceRegex.exec(source);

    if (matches && matches[0]) {
      const className = namespace;
      const moduleName = externalNamespaces[namespace];
      namespacesToReplace[className] = moduleName;
    }
  });

  // Extract existing namespaces as imported variables
  Object.keys(namespacesToReplace).forEach((namespace) => {
    const requireStatement = `${namespace} = require '${namespacesToReplace[namespace]}'\n`;
    newSource = `${requireStatement}${newSource}`
  });

  // Export defined class
  const actualClass = /^class\s+(\S+)/.exec(source)[1];
  newSource = `${newSource}module.exports = ${actualClass}\n`;

  return newSource;
};
