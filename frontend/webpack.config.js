module.exports = {
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}; 