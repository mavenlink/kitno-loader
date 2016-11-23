const path = require('path');

module.exports = function(source) {
  const namespacesToReplace = {};
  let shortNamespaceToRequire = {};
  let namespaceToShort = {};
  let shortToNamespace = {};

  // Given a dupe `shortName`, use it's corresponding `namespace` and come up with a unique one.
  const namespaceDedupe = (shortName, namespace) => {
    namespace = namespace.split('.').reverse().slice(0, -1);
    // `reverse` mutates so this will put `namespace` back in original order with
    shortName = namespace.reverse().join('');

    if (shortToNamespace[shortName] && namespace.length > 0) {
      return namespaceDedupe(shortName, namespace);
    }

    return shortName;
  };

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

  // Extract existing namespaces as imported variables
  Object.keys(namespacesToReplace).forEach((namespace) => {
    let shortName = namespace.split('.').pop();

    if (shortToNamespace[shortName]) {
      shortName = namespaceDedupe(shortName, namespace);
    } else {
      shortNamespaceToRequire[shortName] = `require '${namespacesToReplace[namespace]}'\n`;
    }
    namespaceToShort[namespace] = shortName;
    shortToNamespace[shortName] = namespace;
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
  let definitionName = /^class\s+(\S+)/.exec(source)[1];
  let classDefinition = definitionName;
  let actualClass = classDefinition.split('.').pop();

  if (shortToNamespace[actualClass]) {
    actualClass = namespaceDedupe(actualClass, classDefinition);
  }
  const replacedSource = newSource.replace(definitionName, actualClass);
  newSource = `${replacedSource}module.exports = ${actualClass}\n`;

  return newSource;
};
