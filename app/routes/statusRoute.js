const Router = require('koa-router');
const {
  handlerAlive,
  handlerHealthy,
} = require('../controllers/statusController');

const createRouterStatus = () => {
  const router = new Router();

  router.get('/status/healthy', handlerHealthy);
  router.get('/status/alive', handlerAlive);
  return router;
};
module.exports = {
  createRouterStatus,
};
