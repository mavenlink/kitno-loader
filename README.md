# kitno-loader

Two-pass loader for Webpack bundling.
In-memory rewrites of global namespace usages into CommonJS require expressions.
Useful for migrating a Rails project to CommonJS module bundling.
Inspired from the original [Killing In The Namespace Of](https://github.com/mavenlink/killing-in-the-namespace-of).

### First Pass

- Specify interesting namespaces to identify
- Collect namespace -> file path

```
./bin/globalToPathMapper.js app/**/*.coffee
```

### Second Pass

- For each namespace, use JavaScript module
  - `require`/`import` at the top of the file
  - local variable used for namespace (avoid collision)


## How-to-use

Given the complexity of globals -> locals problem and the desired simplicity of a solution, codebase massaging is required to effectively run `kitno-loader`.

1. All code references in comments should be in enclosed with backticks
2. Any existing exports of globals should be deleted
3. Any existing JavaScript initialization code (in script tags) should be its own entry file. Any dependencies from the Rails environment should be serialized on the `window` via a script tag. 
