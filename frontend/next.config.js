const fs = require('fs')
const path = require('path')

const hasBlockedAccessCause = (error) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  if (error.code === 'EACCES') {
    return true
  }

  if (Array.isArray(error.errors)) {
    return error.errors.some(hasBlockedAccessCause)
  }

  return hasBlockedAccessCause(error.cause)
}

const isBlockedOptionalFetch = (reason) => {
  if (
    reason instanceof TypeError &&
    reason.message === 'fetch failed' &&
    hasBlockedAccessCause(reason)
  ) {
    return true
  }

  return false
}

const isWebpackSnapshotWarning = (args) =>
  args.some(
    (arg) =>
      typeof arg === 'string' &&
      arg.includes('[webpack.cache.PackFileCacheStrategy]') &&
      arg.includes('Unable to snapshot resolve dependencies')
  )

const originalConsoleError = console.error.bind(console)
const originalConsoleWarn = console.warn.bind(console)

console.error = (...args) => {
  if (args.some(isBlockedOptionalFetch) || isWebpackSnapshotWarning(args)) {
    return
  }

  originalConsoleError(...args)
}

console.warn = (...args) => {
  if (isWebpackSnapshotWarning(args)) {
    return
  }

  originalConsoleWarn(...args)
}

process.on('unhandledRejection', (reason) => {
  if (isBlockedOptionalFetch(reason)) {
    return
  }

  throw reason
})

process.on('uncaughtException', (error) => {
  if (isBlockedOptionalFetch(error)) {
    console.warn('Blocked optional network fetch during local development.')
    return
  }

  throw error
})

class CopyServerChunksToRootPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('CopyServerChunksToRootPlugin', () => {
      const serverDir = compiler.outputPath
      const chunksDir = path.join(serverDir, 'chunks')

      if (!fs.existsSync(chunksDir)) {
        return
      }

      for (const file of fs.readdirSync(chunksDir)) {
        if (file.endsWith('.js')) {
          fs.copyFileSync(path.join(chunksDir, file), path.join(serverDir, file))
        }
      }
    })
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,

  images: {
    unoptimized: true,
  },

  webpack: (config, { isServer }) => {
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    }

    if (isServer) {
      config.plugins = config.plugins || []
      config.plugins.push(new CopyServerChunksToRootPlugin())
    }

    return config
  },
}

module.exports = nextConfig