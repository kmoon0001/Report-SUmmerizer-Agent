import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    shell: false,
    timeout: 60000
  });
  return {
    command: [command, ...args].join(' '),
    status: result.status,
    error: result.error?.message || null,
    stdout: String(result.stdout || '').slice(0, 10000),
    stderr: String(result.stderr || '').slice(0, 10000)
  };
}

const checks = [
  run('pac', ['help']),
  run('pac', ['auth', 'list']),
  run('pac', ['org', 'list'])
];

const pacAvailable = checks[0].status === 0 && /Microsoft PowerPlatform CLI/i.test(checks[0].stdout);
const authAvailable = checks[1].status === 0 && !/No profiles|not authenticated/i.test(checks[1].stdout + checks[1].stderr);
const activeAuth = (checks[1].stdout.split(/\r?\n/).find((line) => /\*\s+/.test(line)) || '').trim();
const activeOrg = (checks[2].stdout.split(/\r?\n/).find((line) => /^\*\s+/.test(line)) || '').trim();

const report = {
  pacAvailable,
  authAvailable,
  readyForTenantDeployment: pacAvailable && authAvailable,
  activeAuth,
  activeOrg,
  checks,
  nextStep: pacAvailable
    ? 'Select the correct PAC auth profile/environment before solution work.'
    : 'Install Microsoft Power Platform CLI, authenticate with pac auth create, then rerun this preflight.'
};

console.log(JSON.stringify(report, null, 2));

if (!report.readyForTenantDeployment) {
  process.exitCode = 1;
}
