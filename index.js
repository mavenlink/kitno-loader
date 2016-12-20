const loaderUtils = require('loader-utils');
const path = require('path');
const mapper = require('./bin/globalToPathMapper');

let loaderOptions;

module.exports = function loader(source) {
  this.cacheable();
  const namespacesToReplace = {};
  const shortNamespaceToRequire = {};
  const namespaceToShort = {};
  const shortToNamespace = {};
  const namespaceRegexp = namespace =>
    // for now don't include a capital letter after a period
    // because we haven't dealt with externals (i.e. `Notice.Alert`)
     `([^\\w\\.])(${namespace})(\\s|\\.[a-z]|\\(|,)`;


  if (!loaderOptions) {
    loaderOptions = loaderUtils.parseQuery(this.query);
    const mapped = mapper(loaderOptions.kitnoGlobs);
    loaderOptions.namespaces.internal = mapped.internal;
    // console.log(loaderOptions.namespaces.internal, 'internal first');
  }
  // console.log(loaderOptions.namespaces.internal, 'internal others');

  // Given a dupe `shortName`, use it's corresponding `namespace` and come up with a unique one.
  const namespaceDedupe = (shortName, namespace) => {
    const nameDefs = namespace.split('.');
    const newName = `${nameDefs.pop()}${shortName}`;

    if (shortToNamespace[newName] && namespace.length > 0) {
      return namespaceDedupe(newName, nameDefs.join('.'));
    }

    return newName;
  };

  // Collect all known global namespaces
  const internalNamespaces = loaderOptions.namespaces.internal;
  Object.keys(internalNamespaces).sort().forEach((namespace) => {
    const namespaceRegex = new RegExp(namespaceRegexp(namespace));
    const matches = namespaceRegex.exec(source);

    const invalidNamespaceRegex = new RegExp(`class ${namespace}\\s`);
    const invalidMatches = invalidNamespaceRegex.exec(source);

    if (matches && matches[1] && !invalidMatches) {
      const className = namespace;
      const namespacePath = internalNamespaces[namespace];
      const relativeRequirePath = path.relative(this.context, namespacePath);
      namespacesToReplace[className] = `./${relativeRequirePath}`;
    }
  });

  // Collect all known external namespaces
  const externalNamespaces = loaderOptions.namespaces.external;
  Object.keys(externalNamespaces).sort().forEach((namespace) => {
    const namespaceRegex = new RegExp(`[^\\w\\.](${namespace})[^\\w\\.]`);
    const matches = namespaceRegex.exec(source);

    if (matches && matches[1]) {
      const className = namespace;
      const moduleName = externalNamespaces[namespace];
      namespacesToReplace[className] = moduleName;
    }
  });

  // Extract existing namespaces as imported variables
  Object.keys(namespacesToReplace).sort().forEach((namespace) => {
    const defNames = namespace.split('.');
    let shortName = defNames.pop();

    if (shortToNamespace[shortName]) {
      shortName = namespaceDedupe(shortName, defNames.join('.'));
    }

    shortNamespaceToRequire[shortName] = `require '${namespacesToReplace[namespace]}'`;
    namespaceToShort[namespace] = shortName;
    shortToNamespace[shortName] = namespace;
  });

  let newSource = `\n\n${source}\n\n`;
  let replacedSource = newSource;
  const requireStatements = [];
  // Write the require statements at the top of the source
  Object.keys(namespaceToShort).sort().forEach((namespace) => {
    const shortName = namespaceToShort[namespace];
    const requireStatement = `${shortName} = ${shortNamespaceToRequire[shortName]}\n`;
    replacedSource = replacedSource.replace(new RegExp(namespaceRegexp(namespace), 'g'), `$1${shortName}$3`);
    requireStatements.push(requireStatement);
  });
  newSource = `${requireStatements.join('')}${replacedSource}`;

  // Export defined class
  const matches = /(^)class\s+(\S+)/m.exec(source);
  const definitionName = (matches || [])[2];
  if (matches && definitionName && internalNamespaces[definitionName]) {
    const classDefinition = definitionName;
    const defNames = classDefinition.split('.');
    let actualClass = defNames.pop();

    if (shortToNamespace[actualClass]) {
      actualClass = namespaceDedupe(actualClass, defNames.join('.'));
    }
    replacedSource = newSource.replace(new RegExp(definitionName, 'g'), actualClass);
    newSource = `${replacedSource}module.exports = ${actualClass}\n`;
  } else {
    console.log('DAWG!', matches, definitionName); // eslint-disable-line no-console
    // console.log('===========================');
    // console.log('===========================');
    // console.log('===========================');
    // console.log('OG SOURCE', source)
    // console.log('NEW SOURCE', newSource)
    // console.log('===========================');
    // console.log('===========================');
    // console.log('===========================');
  }

  return newSource;
};
