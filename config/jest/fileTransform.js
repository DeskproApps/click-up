const path = require("path");

module.exports = {
  process(_src, filename) {
    const assetFilename = filename
      ? JSON.stringify(path.basename(filename))
      : "";

    return `module.exports = ${assetFilename};`;
  },
  getCacheKey() {
    return "svgTransform";
  },
};
