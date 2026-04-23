import { spawn } from 'child_process';
import fs from 'fs';

// Simple parser for KEY=VALUE
function parseEnv(envFile) {
  if (!fs.existsSync(envFile)) return {};
  const content = fs.readFileSync(envFile, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });
  return env;
}

const args = process.argv.slice(2);
const separatorIndex = args.indexOf('--');
if (separatorIndex === -1) {
  console.error('Usage: node scripts/runWithEnv.mjs <env-file> -- <command> [args...]');
  process.exit(1);
}

const envFile = args[0];
const command = args[separatorIndex + 1];
const commandArgs = args.slice(separatorIndex + 2);

const env = { ...process.env, ...parseEnv(envFile) };

const child = spawn(command, commandArgs, {
  env,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
