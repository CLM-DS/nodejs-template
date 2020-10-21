const Router = require('koa-router');
const { handlerAlive, handlerHealthy } = require('../controllers/statusController');

const router = new Router();

router.get('/status/healthy', handlerHealthy);
router.get('/status/alive', handlerAlive);

module.exports = router;
