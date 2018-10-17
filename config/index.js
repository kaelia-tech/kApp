var path = require('path')

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080

module.exports = {
  // Webpack aliases
  aliases: {
    quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    schemas: path.resolve(__dirname, '../src/schemas'),
    '@': path.resolve(__dirname, '../src/components'),
    variables: path.resolve(__dirname, '../src/themes/quasar.variables.styl'),
    config: path.resolve(__dirname, './client-config.json')
  },

  // Progress Bar Webpack plugin format
  // https://github.com/clessg/progress-bar-webpack-plugin#options
  progressFormat: ' [:bar] ' + ':percent'.bold + ' (:msg)',

  // Default theme to build with ('ios' or 'mat')
  defaultTheme: 'mat',

  build: {
    env: require('./prod.env'),
    publicPath: '',
    productionSourceMap: false
    // Remove unused CSS
    // Disable it if it has side-effects for your specific app
    // As we use dynamic components remove this 
    //purifyCSS: true
  },
  dev: {
    env: require('./dev.env'),
    cssSourceMap: true,
    // auto open browser or not
    openBrowser: true,
    publicPath: '/',
    port: clientPort,
    /* To enable HTTPS
    https: {
      key: path.join(__dirname, 'server.key'),
      cert: path.join(__dirname, 'server.crt'),
      port: clientPort
    },
    */

    // If for example you are using Quasar Play
    // to generate a QR code then on each dev (re)compilation
    // you need to avoid clearing out the console, so set this
    // to "false", otherwise you can set it to "true" to always
    // have only the messages regarding your last (re)compilation.
    clearConsoleOnRebuild: false,

    // Proxy your API if using any.
    // Also see /build/script.dev.js and search for "proxy api requests"
    // https://github.com/chimurai/http-proxy-middleware
    // Does not work well to manage API path with feathers, notably on WS
    proxyTable: {
      '/api': {
        target: 'http://localhost:' + serverPort,
        changeOrigin: true,
        logLevel: 'debug'
      },
      '/apiws': {
        target: 'http://localhost:' + serverPort,
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'
      },
      // The auth endpoints are not easy to prefix so we manage it manually
      '/auth': {
        target: 'http://localhost:' + serverPort,
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
