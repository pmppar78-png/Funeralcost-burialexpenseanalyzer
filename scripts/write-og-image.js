// Writes og-default.png (1200x630 social card) from its base64 source.
// The PNG is a render of og-default.svg. It is stored as base64 text because the
// repo is updated through text-only commit tooling.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const b64 = fs.readFileSync(path.join(root, 'assets', 'og-default.png.b64'), 'utf8').replace(/\s+/g, '');
fs.writeFileSync(path.join(root, 'og-default.png'), Buffer.from(b64, 'base64'));
console.log('wrote og-default.png');
