const { spawn } = require('node:child_process');
const { resolve } = require('node:path');
const { existsSync } = require('node:fs');

const registry = require('./backend-apps.json');
const requested = process.argv.slice(2);
const unknown = requested.filter(name => !registry.some(app => app.name === name));
if (unknown.length) {
  console.error(`Unknown applications: ${unknown.join(', ')}. Available: ${registry.map(app => app.name).join(', ')}`);
  process.exit(1);
}
const applications = requested.length
  ? registry.filter(app => requested.includes(app.name))
  : registry;

for (const application of applications) {
  const entry = resolve(__dirname, '../dist/backend', application.directory, 'src/main.js');
  if (!existsSync(entry)) {
    console.error(`Missing build for ${application.name}. Run npm run build:${application.name} first.`);
    process.exit(1);
  }
}

const children = [];
let stopping = false;

function stop(exitCode) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill();
}

for (const application of applications) {
  const entry = resolve(__dirname, '../dist/backend', application.directory, 'src/main.js');
  const envFile = resolve(__dirname, '../backend', application.directory, '.env');
  const env = { ...process.env };
  // A global PORT must not make all services bind to the same port.
  if (applications.length > 1) delete env.PORT;
  const child = spawn(process.execPath, [`--env-file-if-exists=${envFile}`, entry], {
    stdio: 'inherit',
    env: { ...env, SERVICE_NAME: application.name },
  });
  children.push(child);
  child.on('error', error => {
    console.error(application.name, error.message);
    stop(1);
  });
  child.on('exit', code => stop(code || 1));
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
