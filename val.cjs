const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync('./.github/workflows/android-build.yml', 'utf8');
try {
  yaml.parse(file);
  console.log("YAML is perfectly valid.");
} catch (e) {
  console.error("YAML error:", e);
}
