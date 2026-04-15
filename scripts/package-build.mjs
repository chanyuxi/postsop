import { build, context } from 'esbuild'
import { spawn } from 'node:child_process'
import { readdir, readFile, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import process from 'node:process'

const require = createRequire(import.meta.url)
const tscBinPath = require.resolve('typescript/bin/tsc')

const watchMode = process.argv.includes('--watch')
const packageDir = process.cwd()
const srcDir = join(packageDir, 'src')
const outDir = join(packageDir, 'dist')
const tsconfigPath = join(packageDir, 'tsconfig.json')
const packageJsonPath = join(packageDir, 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const format = packageJson.type === 'module' ? 'esm' : 'cjs'

const entryPoints = await collectEntryPoints(srcDir)

if (entryPoints.length === 0) {
  throw new Error(`No TypeScript entry points found under ${srcDir}`)
}

await rm(outDir, { recursive: true, force: true })

const esbuildOptions = {
  entryPoints,
  format,
  logLevel: 'info',
  outbase: srcDir,
  outdir: outDir,
  platform: 'node',
  bundle: false,
  sourcemap: true,
  target: 'es2023',
  tsconfig: tsconfigPath,
}

if (watchMode) {
  const buildContext = await context(esbuildOptions)
  const declarationWatcher = spawnTsc([
    '--project',
    tsconfigPath,
    '--emitDeclarationOnly',
    '--watch',
    '--preserveWatchOutput',
  ])

  let shuttingDown = false

  const shutdown = async (code = 0) => {
    if (shuttingDown) {
      return
    }

    shuttingDown = true
    declarationWatcher.kill()
    await buildContext.dispose()
    process.exit(code)
  }

  declarationWatcher.on('exit', (code) => {
    if (!shuttingDown && code && code !== 0) {
      void shutdown(code)
    }
  })

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      void shutdown(0)
    })
  }

  await buildContext.watch()
  await new Promise(() => {})
} else {
  await Promise.all([
    build(esbuildOptions),
    runTsc(['--project', tsconfigPath, '--emitDeclarationOnly']),
  ])
}

function spawnTsc(args) {
  return spawn(process.execPath, [tscBinPath, ...args], {
    cwd: packageDir,
    stdio: 'inherit',
  })
}

function runTsc(args) {
  return new Promise((resolve, reject) => {
    const child = spawnTsc(args)

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`TypeScript exited with code ${code ?? 'unknown'}`))
    })
  })
}

async function collectEntryPoints(directory) {
  const entries = []
  const children = await readdir(directory, { withFileTypes: true })

  for (const child of children) {
    const fullPath = join(directory, child.name)

    if (child.isDirectory()) {
      entries.push(...(await collectEntryPoints(fullPath)))
      continue
    }

    if (!child.isFile()) {
      continue
    }

    if (
      !/\.(cts|mts|ts|tsx)$/.test(child.name) ||
      child.name.endsWith('.d.ts')
    ) {
      continue
    }

    entries.push(fullPath)
  }

  return entries
}
