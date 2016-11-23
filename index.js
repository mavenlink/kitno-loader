const path = require('path');

module.exports = function(source) {
  const namespacesToReplace = {};
  let shortNamespaceToRequire = {};
  let namespaceToShort = {};
  let shortToNamespace = {};

  // Given a dupe `shortName`, use it's corresponding `namespace` and come up with a unique one.
  const namespaceDedupe = (shortName, namespace) => {
    let nameDefs = namespace.split('.');
    const newName = `${nameDefs.pop()}${shortName}`;

    if (shortToNamespace[newName] && namespace.length > 0) {
      return namespaceDedupe(newName, nameDefs.join('.'));
    }

    return newName;
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

  let replacedSource;
  let newSource = `\n${source}\n\n`;
  // Write the require statements at the top of the source
  Object.keys(namespaceToShort).forEach((namespace) => {
    const shortName = namespaceToShort[namespace];
    const requireStatement = `${shortName} = ${shortNamespaceToRequire[shortName]}\n`;
    replacedSource = newSource.replace(namespace, shortName);
    newSource = `${requireStatement}${replacedSource}`
  });

  // Export defined class
  let definitionName = /^class\s+(\S+)/.exec(source)[1];
  let classDefinition = definitionName;
  let defNames = classDefinition.split('.');
  let actualClass = defNames.pop();

  if (shortToNamespace[actualClass]) {
    actualClass = namespaceDedupe(actualClass, defNames.join('.'));
  }
  replacedSource = newSource.replace(definitionName, actualClass);
  newSource = `${replacedSource}module.exports = ${actualClass}\n`;

  return newSource;
};
