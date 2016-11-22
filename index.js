const path = require('path');

module.exports = function(source) {
  const namespacesToReplace = {};

  // Collect all known global namespaces
  const internalNamespaces = this.query.namespaces.internal;
  Object.keys(internalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`[^\\w\\.](${namespace})`);
    const matches = namespaceRegex.exec(source);

    const invalidNamespaceRegex = new RegExp(`class ${namespace}`);
    const invalidMatches = invalidNamespaceRegex.exec(source);

    if (matches && matches[1] && !invalidMatches) {
      const className = namespace;
      const namespacePath = internalNamespaces[namespace];
      const relativeRequirePath = path.relative(this.context, namespacePath);
      namespacesToReplace[className] = `./${relativeRequirePath}`;
    }
  });

  // Collect all known external namespaces
  const externalNamespaces = this.query.namespaces.external;
  Object.keys(externalNamespaces).forEach((namespace) => {
    const namespaceRegex = new RegExp(`[^\\w\\.](${namespace})[^\\w\\.]`);
    const matches = namespaceRegex.exec(source);

    if (matches && matches[1]) {
      const className = namespace;
      const moduleName = externalNamespaces[namespace];
      namespacesToReplace[className] = moduleName;
    }
  });

  let shortNamespaceToRequire = {};
  let namespaceToShort = {};
  // Extract existing namespaces as imported variables
  Object.keys(namespacesToReplace).forEach((namespace) => {
    const shortName = namespace.split('.').pop();
    shortNamespaceToRequire[shortName] = `require '${namespacesToReplace[namespace]}'\n`;
    namespaceToShort[namespace] = shortName;
  });

  let newSource = `\n${source}\n\n`;
  // Write the require statements at the top of the source
  Object.keys(namespaceToShort).forEach((namespace) => {
    const shortName = namespaceToShort[namespace];
    const requireStatement = `${shortName} = ${shortNamespaceToRequire[shortName]}\n`;
    const replacedSource = newSource.replace(namespace, shortName);
    newSource = `${requireStatement}${replacedSource}`
  });

  // Export defined class
  const classDefinition = /^class\s+(\S+)/.exec(source)[1];
  const actualClass = classDefinition.split('.').pop();
  newSource = `${newSource}module.exports = ${actualClass}\n`;

  return newSource;
};
