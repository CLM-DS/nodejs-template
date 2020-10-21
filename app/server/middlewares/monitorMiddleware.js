const buildLog = (data, type) => ({
  ...data,
  type,
  timestamp: new Date().toString(),
});

const buildResponseLog = ({ response }) => buildLog({
  body: response.body,
  headers: response.headers,
  status: response.status,
}, 'response');

const buildRequestLog = ({ request }) => buildLog({
  body: request.body,
  headers: request.headers,
  url: request.url,
  method: request.method,
}, 'request');

const monitorMiddleware = () => (ctx, next) => {
  ctx.log.info(buildRequestLog(ctx));
  try {
    next();
  } catch (err) {
    ctx.log.error(err);
  }
  ctx.log.info(buildResponseLog(ctx));
};

module.exports = monitorMiddleware;
