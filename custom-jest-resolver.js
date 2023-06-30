module.exports = (request, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(request, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: (pkg) => {
      if (pkg.name === "simplebar-react") {
        return {
          ...pkg,
          // Alter the value of `main` before resolving the package
          main: pkg.module || pkg.main,
        };
      }
      return pkg;
    },
  });
};
