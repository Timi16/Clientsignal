/**
 * PM2 process file for the ClientSignal backend.
 *
 * Usage (on the server, from backend/):
 *   pm2 start ecosystem.config.js
 *   pm2 save && pm2 startup   # persist across reboots
 *
 * Each service reads the shared backend/.env; per-service gRPC ports
 * come from their in-code defaults (auth 5001 … messaging 5005).
 */
const svc = (name) => ({
  name,
  cwd: __dirname,
  script: 'npm',
  args: `run dev:${name}`, // ts-node runners, same as the repo's npm scripts
  max_memory_restart: '400M',
  autorestart: true,
  restart_delay: 3000,
  out_file: `./logs/${name}.log`,
  error_file: `./logs/${name}.err.log`,
  merge_logs: true,
  time: true, // prefix log lines with timestamps
});

module.exports = {
  apps: [
    'auth',
    'attorney',
    'lead',
    'case',
    'messaging',
    'mail',
    'gateway',
  ].map(svc),
};
