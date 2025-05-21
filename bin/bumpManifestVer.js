const fs = require("fs");

/**
 * @param {string} versionStringRaw 
 * @param {string} labels
 */
function bumpSemanticVersion(versionStringRaw, labels) {
  const versionString = (versionStringRaw ?? '0.0.0').trim();
  if (!versionString.match(/^\d+\.\d+\.\d+$/)) {
    throw new Error("Invalid version string: " + versionStringRaw);
  }

  let [major, minor, patch] = versionString.trim().split(".");

  if (labels?.includes("major")) {
    major = parseInt(major) + 1;
    minor = 0;
    patch = 0;
  } else if (labels?.includes("minor")) {
    minor = parseInt(minor) + 1;
    patch = 0;
  } else {
    patch = parseInt(patch) + 1;
  }

  return `${major}.${minor}.${patch}`;
};

const packageJson = JSON.parse(fs.readFileSync("./manifest.json", "utf8"));

packageJson.version = bumpSemanticVersion(
  process.argv[3],
  process.argv[2],
);

fs.writeFileSync("./manifest.json", JSON.stringify(packageJson, null, 2));
console.log(packageJson.version);
