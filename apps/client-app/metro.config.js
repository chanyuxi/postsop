const fs = require('fs')
const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const workspacePackagesRoot = path.resolve(workspaceRoot, 'packages')
const appPackageJson = require('./package.json')

const appDependencyNames = new Set([
  ...Object.keys(appPackageJson.dependencies ?? {}),
  ...Object.keys(appPackageJson.devDependencies ?? {}),
  ...Object.keys(appPackageJson.peerDependencies ?? {}),
])

const escapePathForRegex = (value) =>
  value.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')

const workspacePackages = fs
  .readdirSync(workspacePackagesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const packageRoot = path.resolve(workspacePackagesRoot, entry.name)
    const packageJsonPath = path.resolve(packageRoot, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      return null
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    return {
      hasDist: fs.existsSync(path.resolve(packageRoot, 'dist')),
      name: packageJson.name,
      root: packageRoot,
    }
  })
  .filter(Boolean)
  .filter((workspacePackage) => appDependencyNames.has(workspacePackage.name))

const distOnlyBlockList = workspacePackages
  .filter((workspacePackage) => workspacePackage.hasDist)
  .map((workspacePackage) => {
    const escapedPackageRoot = escapePathForRegex(
      path.normalize(workspacePackage.root)
    )

    return new RegExp(
      `^${escapedPackageRoot}[\\\\/](?!dist(?:[\\\\/]|$)|package\\.json$).+`
    )
  })

const blockList = [/(^|[/\\])__tests__[/\\].*/, ...distOnlyBlockList]

/**
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    path.resolve(workspaceRoot, 'node_modules'),
    ...workspacePackages.map((workspacePackage) => workspacePackage.root),
  ],
  resolver: {
    // Metro still needs each package root for package.json/exports resolution,
    // so we expose the package root and block non-dist files when dist exists.
    blockList,
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
  },
}

module.exports = withUniwindConfig(
  mergeConfig(getDefaultConfig(projectRoot), config),
  {
    // relative path to your global.css file (from previous step)
    cssEntryFile: './src/global.css',
  }
)
