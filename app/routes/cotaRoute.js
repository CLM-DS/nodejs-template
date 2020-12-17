const Router = require('koa-router');
const { handlerCota } = require('../controllers');

const createRouterCota = () => {
  const router = new Router();

  router.post('/cota', handlerCota);
  return router;
};
module.exports = {
  createRouterCota,
};
