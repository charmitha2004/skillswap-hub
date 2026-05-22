const { spawnSync } = require('child_process')
const path = require('path')

process.env.NEXT_TELEMETRY_DISABLED = '1'
process.env.NO_UPDATE_NOTIFIER = '1'

const clean = spawnSync(process.execPath, [path.join(__dirname, 'clean-next.js')], {
  stdio: 'inherit',
})

if (clean.status !== 0) {
  process.exit(clean.status || 1)
}

const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')
const dev = spawnSync(process.execPath, [nextBin, 'dev', ...process.argv.slice(2)], {
  env: process.env,
  stdio: 'inherit',
})

process.exit(dev.status || 0)
