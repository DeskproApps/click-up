const fs = require("fs");

const bumpSemanticVersion = (versionString, bumpType = "patch") => {
  let [major, minor, patch] = versionString.split(".");

  switch (bumpType) {
    case "major":
      major = parseInt(major) + 1;
      minor = 0;
      patch = 0;
      break;

    case "minor":
      minor = parseInt(minor) + 1;
      patch = 0;
      break;

    case "patch":
      patch = parseInt(patch) + 1;
      break;

    default:
      break;
  }

  return `${major}.${minor}.${patch}`;
};

const packageJson = JSON.parse(fs.readFileSync("./manifest.json", "utf8"));
//1
packageJson.version = bumpSemanticVersion(
  process.argv[3] ? process.argv[3] : packageJson.version,
  process.argv[2]
);

fs.writeFileSync("./manifest.json", JSON.stringify(packageJson));
