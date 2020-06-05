const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://bi-beta-api.weidiango.com/api_1',
    changeOrigin: true,
  })
);
};