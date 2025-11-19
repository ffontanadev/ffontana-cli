const fs = require('fs-extra');
const path = require('path');

fs.copySync(
  path.join(__dirname, '..', 'templates'),
  path.join(__dirname, '..', 'dist', 'templates')
);
