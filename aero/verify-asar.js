const path = require('path');

let asar;
try {
  asar = require('@electron/asar');
} catch {
  console.error('Install @electron/asar first: npm install --no-save @electron/asar');
  process.exit(1);
}

const archive = path.join(__dirname, 'app.asar.patched');
const files = asar.listPackage(archive);
console.log('entries', files.length);
console.log('main entries', files.filter((file) => file.endsWith('lib/main.js')));

const fs = require('fs');
const main = asar.extractFile(archive, 'lib/main.js');
const patched = fs.readFileSync(path.join(__dirname, 'main.patched.js'));
console.log('main bytes', main.length, 'equal', main.equals(patched));

const pkg = JSON.parse(asar.extractFile(archive, 'package.json').toString('utf8'));
console.log('app package', pkg.name, pkg.version);
