/* global console, setTimeout */

import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(__dirname, '..')
const distDir = path.join(appRoot, 'dist')
const distEntry = path.join(appRoot, 'dist', 'main.js')
const contractsDistDir = path.resolve(
  appRoot,
  '..',
  '..',
  'packages',
  'shared',
  'contracts',
  'dist',
)
const packageManagerExec = process.env.npm_execpath

let shuttingDown = false
let buildProcess = null
let runtimeProcess = null

function prefixStream(stream, prefix, onLine = () => {}) {
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    const text = chunk.replace(/\r?\n$/, '')
    if (!text) {
      return
    }

    for (const line of text.split(/\r?\n/)) {
      if (line) {
        onLine(line)
        console.log(`${prefix} ${line}`)
      }
    }
  })
}

function createPackageManagerCommand(scriptName) {
  if (packageManagerExec) {
    return [process.execPath, [packageManagerExec, 'run', scriptName]]
  }

  if (process.platform === 'win32') {
    return [
      process.env.ComSpec ?? 'cmd.exe',
      ['/d', '/s', '/c', `pnpm.cmd run ${scriptName}`],
    ]
  }

  return ['pnpm', ['run', scriptName]]
}

async function runScript(scriptName, prefix) {
  const command = createPackageManagerCommand(scriptName)

  const child = spawn(command[0], command[1], {
    cwd: appRoot,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
    windowsHide: true,
  })

  prefixStream(child.stdout, prefix)
  prefixStream(child.stderr, prefix)

  return new Promise((resolve, reject) => {
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `${prefix} exited unexpectedly (${signal ?? `code ${code ?? 'unknown'}`})`,
        ),
      )
    })
  })
}

async function waitForFile(filePath) {
  while (!shuttingDown) {
    try {
      await access(filePath)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }
}

function startBuildWatcher() {
  const command = createPackageManagerCommand('build:watch')

  const child = spawn(command[0], command[1], {
    cwd: appRoot,
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
    windowsHide: true,
  })

  let markReady = () => {}
  let markFailed = () => {}
  let isReady = false

  const ready = new Promise((resolve, reject) => {
    markReady = resolve
    markFailed = reject
  })

  const maybeReady = (line) => {
    if (isReady) {
      return
    }

    if (
      line.includes('Successfully compiled') ||
      line.includes('Watching for file changes')
    ) {
      isReady = true
      markReady()
    }
  }

  prefixStream(child.stdout, '[build]', maybeReady)
  prefixStream(child.stderr, '[build]')

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      if (!isReady) {
        markFailed(
          new Error(
            `[build] exited before the watch compiler became ready (${signal ?? `code ${code ?? 'unknown'}`})`,
          ),
        )
      }

      console.error(
        `[build] exited unexpectedly (${signal ?? `code ${code ?? 'unknown'}`})`,
      )
      shutdown(1)
    }
  })

  return { child, ready }
}

function startRuntimeWatcher() {
  const child = spawn(
    process.execPath,
    [
      '--watch',
      '--watch-preserve-output',
      '--watch-path',
      distDir,
      '--watch-path',
      contractsDistDir,
      distEntry,
    ],
    {
      cwd: appRoot,
      env: { ...process.env, NODE_ENV: process.env.NODE_ENV ?? 'development' },
      stdio: ['inherit', 'pipe', 'pipe'],
      windowsHide: true,
    },
  )

  prefixStream(child.stdout, '[runtime]')
  prefixStream(child.stderr, '[runtime]')

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(
        `[runtime] exited unexpectedly (${signal ?? `code ${code ?? 'unknown'}`})`,
      )
      shutdown(1)
    }
  })

  runtimeProcess = child
}

function terminateChild(child) {
  if (!child || child.killed) {
    return
  }

  child.kill('SIGINT')
}

function shutdown(code = 0) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  terminateChild(runtimeProcess)
  terminateChild(buildProcess)

  setTimeout(() => {
    process.exit(code)
  }, 50)
}

try {
  await runScript('build', '[build:init]')
} catch (error) {
  console.error(String(error))
  process.exit(1)
}

await waitForFile(distEntry)

if (!shuttingDown) {
  const buildWatcher = startBuildWatcher()
  buildProcess = buildWatcher.child
  await buildWatcher.ready
  startRuntimeWatcher()
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0))
}
