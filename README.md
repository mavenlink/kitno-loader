# kitno-loader

Two-pass loader for Webpack bundling.
In-memory rewrites of global namespace usages into CommonJS require expressions.
Useful for migrating a Rails project to CommonJS module bundling.
Inspired from the original [Killing In The Namespace Of](https://github.com/mavenlink/killing-in-the-namespace-of).

### First Pass

- Specify interesting namespaces to identify
- Collect namespace -> file path

### Second Pass

- For each namespace, use JavaScript module
  - `require`/`import` at the top of the file
  - local variable used for namespace (avoid collision)