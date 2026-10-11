const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// NeDB stores data in local JSON-like files
const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
const jobs = Datastore.create({ filename: path.join(dataDir, 'jobs.db'), autoload: true });
const applications = Datastore.create({ filename: path.join(dataDir, 'applications.db'), autoload: true });

module.exports = {
  users,
  jobs,
  applications,
};
